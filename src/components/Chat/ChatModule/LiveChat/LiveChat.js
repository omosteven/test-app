import React, { useEffect, useState, useContext, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import API from "../../../../lib/api";
import apiRoutes from "../../../../lib/api/apiRoutes";
import { SocketContext } from "../../../../lib/socket/context/socket";
import {
    FILL_FORM_RECORD,
    NEW_TICKET_UPDATE,
    RECEIVE_MESSAGE,
    SEND_BRANCH_OPTION,
    SEND_CUSTOMER_CONVERSATION_REPLY,
    SEND_CUSTOMER_MESSAGE,
    SUBSCRIBE_TO_TICKET,
    MARK_AS_READ,
    SEND_AGENT_TICKET,
    AGENT_IS_UNAVAILABLE,
} from "../../../../lib/socket/events";
import { dataQueryStatus } from "../../../../utils/formatHandlers";
import {
    generateID,
    getErrorMessage,
    incrementDateTime,
    isDeviceMobileTablet,
    validateEmail,
} from "../../../../utils/helper";
import LiveChatInput from "./LiveChatInput/LiveChatInput";
import LiveChatStatusBar from "./LiveChatStatusBar/LiveChatStatusBar";
import MessageBody from "./MessageBody/MessageBody";
import {
    AGENT_FOLLOWUP,
    appMessageUserTypes,
    branchOptionsTypes,
    formInputTypes,
    messageOptionActions,
    messageStatues,
    messageTypes,
    TICKET_CLOSED_ALERT,
    ADD_EMAIL_ADDRESS,
    FORM_FILLED_COMPLETELY,
    INPUT_NEEDED,
    AGENT_UNAVAILABLE,
} from "./MessageBody/Messages/enums";
import TicketsHeader from "../TicketsHeader/TicketsHeader";
import {
    setActiveTicket,
    saveTicketsMessages,
    setTicketMessages,
    updateTicketMessageStatus,
    deleteTicketsMessages,
    clearThirdUserMessage,
} from "../../../../store/tickets/actions";
import { ISSUE_DISCOVERY } from "components/Chat/CustomerTicketsContainer/CustomerTickets/common/TicketStatus/enum";
import CustomerVerification from "./CustomerVerification/CustomerVerification";
import { useFaviconNotification } from "react-favicon-notification";

import "./LiveChat.scss";

const NO_ACTION = "NO_ACTION";
const SMART_CONVOS = "smartConvos";
const { THIRD_USER, WORKSPACE_AGENT } = appMessageUserTypes;
const { LOADING, ERROR, DATAMODE } = dataQueryStatus;
const {
    DEFAULT,
    BRANCH,
    FORM_REQUEST,
    CONVERSATION,
    BRANCH_OPTION,
    ACTION_INFO,
    DOWNTIME_BRANCH,
    DOWNTIME_BRANCH_SUB_SENTENCE,
    BRANCH_SUB_SENTENCE,
    COLLECTION,
    CANNED_RESPONSE,
    SUCCESS,
} = messageTypes;

const { TEXT } = formInputTypes;

const LiveChat = ({
    getCustomerTickets,
    showVerifyForm,
    handleVerifyAction,
    handleCloseTicket,
    handleTicketCloseSuccess,
    handleOpenNewTicket,
}) => {
    const [status, setStatus] = useState(LOADING);
    const [activeConvo, setActiveConvo] = useState(false);
    const [errorMssg, setErrorMssg] = useState("");
    const [forcedAgentTyping, triggerAgentTyping] = useState();
    const [allowUserInput, setAllowUserInput] = useState(false);
    const [currentInputType, setCurrentInputType] = useState(TEXT);
    const [currentFormElement, setCurrentFormElement] = useState();
    const [mssgOptionLoading, setMssgOptionLoading] = useState(false);

    const [fetchingInputStatus, setFetchingInputStatus] = useState(true);
    const [config, setConfig] = useFaviconNotification();

    const { activeTicket: ticket } = useSelector((state) => state.tickets);

    const { conversationBreakers } = useSelector((state) => state.chat);
    const [delayInputNeeded, setDelayInputNeeded] = useState(false);

    const {
        chatSettings: { workspaceId },
    } = useSelector((state) => state.chat);

    const { ticketId, agent, ticketPhase, customer } = ticket;

    const { ticketsMessages } = useSelector((state) => state.tickets);
    const messages = ticketsMessages?.filter(
        (item) => item?.ticketId === ticketId
    );

    const socket = useContext(SocketContext);
    const dispatch = useDispatch();

    const getConvoBreaker = (actionBranchType) => {
        return conversationBreakers?.find(
            (x) => x.actionBranchType === actionBranchType
        );
    };

    const showNotificationIcon = (show) => {
        setConfig({
            ...config,
            innerCircle: true,
            fontColor: "red",
            radius: 6,
            show,
        });
    };

    const requestAllMessages = async () => {
        try {
            setStatus(LOADING);
            setErrorMssg();
            const url = apiRoutes?.getTicketMessages(ticketId);

            const res = await API.get(url);
            if (res.status === 200) {
                setStatus(DATAMODE);
                const { data } = res.data;

                dispatch(
                    deleteTicketsMessages({
                        messageId: SMART_CONVOS,
                        ticketId: ticketId,
                    })
                );

                const messagesArr = data.map((x, index) => {
                    let currentMessageType =
                        data[data?.length - 1]?.messageType;

                    if (currentMessageType === FORM_FILLED_COMPLETELY) {
                        handleConvoBreaker(
                            FORM_FILLED_COMPLETELY,
                            new Date().toISOString(),
                            `${
                                data[data?.length - 1]?.messageId +
                                data[data?.length - 1]?.messageContentId
                            }`
                        );
                        handleAddEmail();
                    }

                    return {
                        ...x,
                        ticketId,
                        suggestionRetryAttempt: 0,
                        messageStatus: messageStatues?.DELIVERED,
                        messageType:
                            x.messageType === DOWNTIME_BRANCH ||
                            x.messageType === DOWNTIME_BRANCH_SUB_SENTENCE
                                ? ACTION_INFO
                                : x.messageType,
                        messageContentId: x?.messageContentId
                            ? x?.messageContentId
                            : x?.deliveryDate,
                        fileAttachments:
                            x?.fileAttachments?.length > 0
                                ? x?.fileAttachments
                                : x?.form?.formElement?.media?.map((media) => ({
                                      fileAttachmentUrl: media?.link,
                                      fileAttachmentType: media?.type,
                                      fileAttachmentName: media?.mediaName,
                                  })),
                    };
                });

                dispatch(setTicketMessages(messagesArr));
            }
        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    };

    const handleIssueDiscovery = async (convo) => {
        try {
            const lastMessage = messages[messages.length - 1];

            if (
                lastMessage.senderType === WORKSPACE_AGENT &&
                lastMessage.messageId !== SMART_CONVOS
            ) {
                return "";
            }

            // triggerAgentTyping(true);

            const { branchOptionId, branchOptionLabel } = convo;
            const discovered = branchOptionId === NO_ACTION;
            const url = apiRoutes?.updateTicketDiscovery(ticketId);

            const res = await API.get(url, {
                params: {
                    discovered,
                },
            });
            if (res.status === 200) {
                // triggerAgentTyping(false);

                if (discovered) {
                    const {
                        actionBranchHeader,
                        displayAverageResponseTime,
                        actionBranchOptions,
                        actionBranchType,
                        actionBranchId,
                        requestRatings,
                        actionBranchMainSentence,
                    } = getConvoBreaker(AGENT_FOLLOWUP);

                    dispatch(
                        saveTicketsMessages({
                            ticketId,
                            messageId: NO_ACTION,
                            messageRefContent: branchOptionLabel,
                            messageContent: actionBranchMainSentence,
                            messageHeader: actionBranchHeader,
                            messageType: ACTION_INFO,
                            messageActionType: actionBranchType,
                            branchOptions: actionBranchOptions,
                            messageActionData: {
                                displayAverageResponseTime,
                                actionBranchId,
                                requestRatings,
                                actionBranchOptions,
                            },
                            senderType: WORKSPACE_AGENT,
                            deliveryDate: new Date().toISOString(),
                        })
                    );

                    socket.emit(SEND_AGENT_TICKET, {
                        ticketId,
                        workspaceId,
                    });

                    sendAgentTicket();

                    handleAddEmail();
                }
            }
        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
            // triggerAgentTyping(false);
        }
    };

    const handleOptConversation = async (convo) => {
        // triggerAgentTyping(true);
        setMssgOptionLoading(true);
        const { conversationId, branchOptionId, branchOptionLabel } = convo;
        dispatch(
            updateTicketMessageStatus({
                messageId: SMART_CONVOS,
                ticketId,
                selectedOption: branchOptionId,
            })
        );
        if (branchOptionId === NO_ACTION) {
            socket.emit(SEND_AGENT_TICKET, {
                ticketId,
                workspaceId,
            });
            sendAgentTicket();
            dispatch(
                saveTicketsMessages({
                    messageId: generateID(),
                    messageContent: branchOptionLabel,
                    messageType: BRANCH_OPTION,
                    senderType: THIRD_USER,
                    deliveryDate: new Date().toISOString(),
                    ticketId,
                })
            );
            handleAddEmail();
        } else {
            await socket.timeout(1000).emit(SEND_CUSTOMER_CONVERSATION_REPLY, {
                ticketId,
                conversationId,
                message: branchOptionLabel,
            });
        }
        handleIssueDiscovery(convo);
    };

    const handleMessageOptionSelect = async (messageOption) => {
        const {
            branchId,
            branchOptionId,
            branchOptionType,
            branchOptionLabel,
            branchOptionValue,
            branchOptionActionType,
            messageActionBranchId,
        } = messageOption;
        setStatus(DATAMODE);
        setErrorMssg();
        setMssgOptionLoading(true);
        // return ""branchOptionActionType

        let newMessageList = await messages.map((x) => {
            return (x.messageType === BRANCH ||
                x.messageType === COLLECTION ||
                x.messageType === BRANCH_OPTION ||
                x.messageType === BRANCH_SUB_SENTENCE ||
                x.messageType === CONVERSATION) &&
                x.messageContentId === branchId
                ? { ...x, selectedOption: branchOptionId }
                : x ||
                      x?.messageActionData?.actionBranchId ===
                          messageActionBranchId;
        });

        dispatch(setTicketMessages(newMessageList));

        if (branchOptionType === branchOptionsTypes?.LINK) {
            window && window.open(branchOptionValue, "_blank").focus();
        }

        if (
            branchOptionActionType ===
                messageOptionActions?.CLOSE_CONVERSATION ||
            branchOptionActionType === messageOptionActions?.CLOSE_TICKET
        ) {
            handleCloseConversation();
            return "";
        }

        if (
            branchOptionActionType === messageOptionActions?.OPEN_NEW_TICKET ||
            branchOptionActionType ===
                messageOptionActions?.RESTART_CONVERSATION
        ) {
            handleOpenNewTicket();
            return "";
        }

        // triggerAgentTyping(true);

        await socket.emit(
            SEND_BRANCH_OPTION,
            {
                ticketId,
                branchId,
                branchOptionId,
                message: branchOptionLabel,
            },
            (err) => {
                if (err) {
                    triggerAgentTyping(false);
                    // const freshMessageList = (messages).map((x) => {
                    //     return x.messageContentId === parentMessageId ? { ...x, selectedOption: "" } : x
                    // })
                } else {
                    triggerAgentTyping(false);
                }
            }
        );
    };

    const handleSocketError = () => {
        setErrorMssg("Tap to Refresh");
        setStatus(ERROR);
    };

    const figureInputAction = () => {
        setFetchingInputStatus(true);
        let shouldAllowUserInput = true;
        let userInputType = "";
        const messageCopy = messages;
        let recentAdminMessage = [...messageCopy]
            .reverse()
            ?.find(
                (message) =>
                    message?.messageActionType !== INPUT_NEEDED &&
                    message?.senderType === WORKSPACE_AGENT
            );

        if (recentAdminMessage) {
            const { messageType, branchOptions, form, messageActionType } =
                recentAdminMessage;
            switch (messageType) {
                case DEFAULT:
                case CANNED_RESPONSE:
                    shouldAllowUserInput = true;
                    userInputType = TEXT;
                    break;

                case ACTION_INFO:
                case CONVERSATION:
                case DOWNTIME_BRANCH:
                case DOWNTIME_BRANCH_SUB_SENTENCE:
                case SUCCESS:
                    if (messageActionType === INPUT_NEEDED) {
                        shouldAllowUserInput = true;
                        userInputType = TEXT;
                    } else {
                        shouldAllowUserInput = false;
                        userInputType = TEXT;
                    }

                    break;

                case BRANCH:
                case COLLECTION:
                    if (branchOptions?.length > 0) {
                        shouldAllowUserInput = false;
                        userInputType = TEXT;
                        setCurrentFormElement();
                    } else {
                        shouldAllowUserInput = true;
                        userInputType = TEXT;
                        setCurrentFormElement();
                    }
                    break;

                case FORM_REQUEST:
                    if (form) {
                        const { formElement, formId } = form || {};
                        setCurrentFormElement({ ...formElement, formId });
                        shouldAllowUserInput = true;
                        userInputType = formElement?.formElementType;
                    } else {
                        setCurrentFormElement();
                        shouldAllowUserInput = true;
                        userInputType = TEXT;
                    }
                    break;
                default:
                    shouldAllowUserInput = true;
                    userInputType = TEXT;
                    setCurrentFormElement();
                    break;
            }
        }
        setAllowUserInput(shouldAllowUserInput);
        setCurrentInputType(userInputType);
        setFetchingInputStatus(false);
    };

    const handleNewMessage = async (request) => {
        const { message, fileAttachments } = request;
        const newMessageId = generateID();
        setMssgOptionLoading(false);
        if (currentFormElement) {
            const { order, formId, formElementId } = currentFormElement;
            socket.emit(FILL_FORM_RECORD, {
                ticketId,
                message: message,
                currentFormOrder: order,
                formElementId,
                formId,
                fileAttachments,
            });
        } else {
            const messageEntry = {
                ticketId,
                senderType: THIRD_USER,
                messageContent: message,
                messageContentId: newMessageId,
                messageId: newMessageId,
                messageType: DEFAULT,
                fileAttachments,
            };

            dispatch(saveTicketsMessages(messageEntry));

            socket.emit(SEND_CUSTOMER_MESSAGE, {
                ticketId,
                message: message,
                messageType: DEFAULT,
                fileAttachments,
            });
        }
    };

    const handleCloseConversation = async () => {
        try {
            setStatus(LOADING);
            setErrorMssg();
            const url = apiRoutes?.closeTicket(ticketId);
            const res = await API.post(url);
            if (res.status === 201) {
                setStatus(DATAMODE);
            }
        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    };

    const handleRateConversation = async (ratingValue) => {
        try {
            setStatus(LOADING);
            setErrorMssg();
            const url = apiRoutes?.rateTicket(ticketId);
            const res = await API.put(url, {
                rating: ratingValue / 20,
            });
            if (res.status === 200) {
                setStatus(DATAMODE);
                dispatch(setActiveTicket());
                getCustomerTickets(null, false);
            }
        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    };

    const sendAgentTicket = async () => {
        try {
            setStatus(LOADING);
            setErrorMssg();
            const url = apiRoutes?.sendAgentTicket;
            const res = await API.post(url, {
                ticketId,
            });
            if (res.status === 201) {
                setStatus(DATAMODE);
            }
        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    };

    const fetchConvoSuggestions = async (message) => {
        try {
            const { messageContent } = message;
            triggerAgentTyping(true);

            const url = apiRoutes?.investigateMesage;
            const res = await API.get(url, {
                params: {
                    search: messageContent.trim(),
                },
            });
            if (res.status === 200) {
                const { data } = res.data;
                triggerAgentTyping(false);

                if (data.length > 0) {
                    const compMessageId = SMART_CONVOS;
                    let messageOptions = data?.map(
                        ({ conversationId, conversationTitle }) => ({
                            branchOptionId: conversationId,
                            branchOptionLabel: conversationTitle,
                            conversationId,
                            parentMessageId: compMessageId,
                        })
                    );
                    messageOptions = [
                        ...messageOptions,
                        {
                            branchOptionLabel: "No, it’s something else",
                            branchOptionId: NO_ACTION,
                            parentMessageId: compMessageId,
                        },
                    ];
                    let newMessage = {
                        messageContentId: compMessageId,
                        messageId: compMessageId,
                        messageContent:
                            "Are any of these relevant to the problem you’re having?",
                        messageType: CONVERSATION,
                        branchOptions: messageOptions,
                        senderType: WORKSPACE_AGENT,
                        selectedOption: "",
                        deliveryDate: new Date().toISOString(),
                    };
                    dispatch(
                        saveTicketsMessages({
                            ...newMessage,
                            ticketId,
                        })
                    );

                    setActiveConvo(true);
                } else {
                    setActiveConvo(true);
                    handleIssueDiscovery({
                        branchOptionId: NO_ACTION,
                        branchOptionLabel: messageContent,
                    });
                }
            } else {
                triggerAgentTyping(false);
            }
        } catch (err) {
            triggerAgentTyping(false);
            setActiveConvo(false);
        }
    };

    const processIssueDiscovery = useCallback(() => {
        const allMessagesCopy = messages;
        if (activeConvo) {
            return "";
        }
        const lastItemIndex = allMessagesCopy.length - 1;
        const lastMessage = messages[lastItemIndex];
        let lastCustomerMssg = [...allMessagesCopy]
            .reverse()
            ?.find((message) => message.senderType === THIRD_USER);

        if (
            allMessagesCopy?.length === 2 &&
            lastCustomerMssg !== undefined &&
            lastCustomerMssg?.messageType === DEFAULT &&
            lastMessage.messageType !== CONVERSATION &&
            lastMessage.messageType !== ACTION_INFO &&
            ticketPhase === ISSUE_DISCOVERY
        ) {
            fetchConvoSuggestions(lastCustomerMssg);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages, activeConvo, ticketPhase]);

    const handleTicketClosure = (ticketStr) => {
        const ticket =
            typeof ticketStr === "string" ? JSON.parse(ticketStr) : ticketStr;
        if (ticket.ticketStatus === false) {
            const {
                actionBranchHeader,
                displayAverageResponseTime,
                actionBranchMainSentence,
                actionBranchOptions,
                actionBranchType,
                actionBranchId,
                requestRatings,
            } = getConvoBreaker(TICKET_CLOSED_ALERT);

            dispatch(
                saveTicketsMessages({
                    ticketId: ticket?.ticketId,
                    messageId: actionBranchId,
                    // messageRefContent: branchOptionLabel,
                    messageContent: actionBranchMainSentence,
                    messageHeader: actionBranchHeader,
                    messageType: ACTION_INFO,
                    messageActionType: actionBranchType,
                    senderType: WORKSPACE_AGENT,
                    branchOptions: actionBranchOptions,
                    messageActionData: {
                        displayAverageResponseTime,
                        actionBranchId,
                        requestRatings,
                    },
                    deliveryDate: new Date().toISOString(),
                })
            );
        }
    };

    const handleMarkAsRead = async (messageId) => {
        await socket.emit(MARK_AS_READ, {
            messageId,
        });
    };

    const handleAddEmail = () => {
        if (!validateEmail(customer?.email)) {
            const {
                actionBranchHeader,
                displayAverageResponseTime,
                actionBranchOptions,
                actionBranchType,
                actionBranchId,
                actionBranchMainSentence,
                requestRatings,
            } = getConvoBreaker(ADD_EMAIL_ADDRESS);

            dispatch(
                saveTicketsMessages({
                    ticketId,
                    messageId: ADD_EMAIL_ADDRESS,
                    messageContent: actionBranchMainSentence,
                    messageHeader: actionBranchHeader,
                    messageType: ACTION_INFO,
                    messageActionType: actionBranchType,
                    branchOptions: actionBranchOptions,
                    messageActionData: {
                        displayAverageResponseTime,
                        actionBranchId,
                        requestRatings,
                    },
                    senderType: WORKSPACE_AGENT,
                    deliveryDate: new Date().toISOString(),
                })
            );
        }
    };

    const handleConvoBreaker = (messageType, deliveryDate, customMessageId) => {
        if (messageType) {
            const {
                actionBranchHeader,
                displayAverageResponseTime,
                actionBranchMainSentence,
                actionBranchOptions,
                actionBranchType,
                actionBranchId,
                requestRatings,
            } = getConvoBreaker(messageType);

            dispatch(
                saveTicketsMessages({
                    ticketId,
                    messageId: customMessageId ? customMessageId : generateID(),
                    // messageRefContent: branchOptionLabel,
                    messageContent: actionBranchMainSentence,
                    messageHeader: actionBranchHeader,
                    messageType: ACTION_INFO,
                    messageActionType: actionBranchType,
                    branchOptions: actionBranchOptions,
                    messageActionData: {
                        displayAverageResponseTime,
                        actionBranchId,
                        requestRatings,
                        actionBranchOptions,
                    },
                    senderType: WORKSPACE_AGENT,
                    deliveryDate: deliveryDate
                        ? incrementDateTime(deliveryDate)
                        : new Date().toISOString(),
                })
            );
        }

        if (messageType === FORM_FILLED_COMPLETELY) {
            // socket.emit(SEND_AGENT_TICKET, {
            //     ticketId,
            //     workspaceId,
            // });
            sendAgentTicket();
            return handleAddEmail();
        }
    };

    const handleScrollChatToBottom = () => {
        if (isDeviceMobileTablet()) {
            const messageBody = document.getElementById("messageBody");
            messageBody.style.scrollBehavior = "smooth";
            messageBody.scrollTop = messageBody.scrollHeight;
        }
    };

    const handleReceive = (message) => {
        const {
            messageType,
            senderType,
            deliveryDate,
            branchOptionActionType,
        } = message;
        if (messageType === BRANCH_OPTION) {
            triggerAgentTyping(true);
        } else {
            triggerAgentTyping(false);
        }

        const { ticketId: newMessageTicketId } = message?.ticket;
        if (senderType === WORKSPACE_AGENT) {
            triggerAgentTyping(false);
            dispatch(
                deleteTicketsMessages({
                    messageId: NO_ACTION,
                    ticketId: newMessageTicketId,
                })
            );
        }

        if (ticketId === newMessageTicketId) {
            handleMarkAsRead(message?.messageId);
        }

        if ([TICKET_CLOSED_ALERT].includes(messageType)) {
            handleConvoBreaker(messageType, deliveryDate);
            return "";
        }

        if (senderType !== THIRD_USER || messageType !== DEFAULT) {
            dispatch(
                saveTicketsMessages({
                    ...message,
                    messageType:
                        messageType === DOWNTIME_BRANCH ||
                        messageType === DOWNTIME_BRANCH_SUB_SENTENCE
                            ? ACTION_INFO
                            : messageType,
                    ticketId: newMessageTicketId,
                    fileAttachments:
                        message?.fileAttachments?.length > 0
                            ? message?.fileAttachments
                            : message?.form?.formElement?.media?.map(
                                  (media) => ({
                                      fileAttachmentUrl: media?.link,
                                      fileAttachmentType: media?.type,
                                      fileAttachmentName: media?.mediaName,
                                  })
                              ),
                    readDate:
                        ticketId === newMessageTicketId &&
                        new Date().toISOString(),
                })
            );
        }

        if ([FORM_FILLED_COMPLETELY].includes(messageType)) {
            handleConvoBreaker(
                messageType,
                deliveryDate,
                `${message?.messageId + message?.messageContentId}`
            );
            return "";
        }

        if (branchOptionActionType === messageOptionActions?.FORWARD_AGENT) {
            handleConvoBreaker(AGENT_FOLLOWUP);
            return "";
        }

        handleScrollChatToBottom();

        triggerAgentTyping(false);
    };

    const handleAgentUnavailable = () => {
        const {
            actionBranchHeader,
            displayAverageResponseTime,
            actionBranchMainSentence,
            actionBranchOptions,
            actionBranchType,
            actionBranchId,
            requestRatings,
        } = getConvoBreaker(AGENT_UNAVAILABLE);

        dispatch(
            updateTicketMessageStatus({
                messageId: NO_ACTION,
                ticketId,
                messageContent: actionBranchMainSentence,
                messageHeader: actionBranchHeader,
                messageType: ACTION_INFO,
                messageActionType: actionBranchType,
                branchOptions: actionBranchOptions,
                messageActionData: {
                    displayAverageResponseTime,
                    actionBranchId,
                    requestRatings,
                    actionBranchOptions,
                },
                senderType: WORKSPACE_AGENT,
                deliveryDate: new Date().toISOString(),
            })
        );
    };

    useEffect(() => {
        requestAllMessages();
        socket.emit(SUBSCRIBE_TO_TICKET, { ticketId });
        socket.on(RECEIVE_MESSAGE, handleReceive);
        // socket.on(CLOSED_TICKET, handleTicketClosureProvision)
        socket.on(NEW_TICKET_UPDATE, handleTicketClosure);
        socket.on(AGENT_IS_UNAVAILABLE, handleAgentUnavailable);
        // socket.on(CLOSED_TICKET, handleTicketClosure);

        socket.on("connect_error", handleSocketError);

        return () => {
            socket.off(RECEIVE_MESSAGE);
            socket.off(NEW_TICKET_UPDATE);
            dispatch(clearThirdUserMessage(ticketId));
            // socket.off(CLOSED_TICKET)

            triggerAgentTyping(false);
            setActiveConvo(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        figureInputAction();
        processIssueDiscovery();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ticketsMessages]);

    const closeTicket = async () => {
        try {
            setStatus(LOADING);
            setErrorMssg();
            const url = apiRoutes?.closeTicket(ticketId);
            const res = await API.post(url);
            if (res.status === 201) {
                setStatus(DATAMODE);
                handleTicketCloseSuccess();
            }
        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    };

    const callTicketClosure = () => {
        if (messages?.length === 1) {
            closeTicket();
        }
    };

    useEffect(() => {
        let timer = setInterval(() => {
            callTicketClosure();
        }, 120000);

        return () => {
            clearInterval(timer);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ticketsMessages, ticketId, messages]);

    const senderReminderEmail = async () => {
        try {
            setStatus(LOADING);
            setErrorMssg();

            let request = {
                ticketId,
                messageType: "inputNeededRemainder",
            };

            const url = apiRoutes?.sendTicketReminder;
            const res = await API.post(url, request);
            if (res.status === 201) {
                setStatus(DATAMODE);
            }
        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    };

    const handleInputNeeded = () => {
        if (messages?.length > 1) {
            let lastMessage = messages[messages?.length - 1];
            if (
                lastMessage?.senderType === WORKSPACE_AGENT &&
                lastMessage?.messageType !== CANNED_RESPONSE
            ) {
                switch (lastMessage?.messageType) {
                    case FORM_REQUEST:
                    case DEFAULT:
                        handleConvoBreaker(INPUT_NEEDED);
                        break;
                    case CONVERSATION:
                    case COLLECTION:
                    case BRANCH:
                        if (lastMessage?.branchOptions?.length > 0) {
                            handleConvoBreaker(INPUT_NEEDED);
                        }
                        break;
                    default:
                        return "";
                }

                if (document.hidden) {
                    showNotificationIcon(true);
                }

                senderReminderEmail();
            }
        }
    };

    const getLastMssgScheduledOptionTime = () => {
        if (messages?.length > 1) {
            let lastMessage = messages[messages?.length - 1];
            let lastMessageMaxOptionTime = 0;

            if (
                lastMessage?.senderType === WORKSPACE_AGENT &&
                lastMessage?.messageType !== CANNED_RESPONSE
            ) {
                if (lastMessage?.branchOptions?.length > 0) {
                    lastMessage?.branchOptions?.map(({ scheduleDuration }) => {
                        if (scheduleDuration) {
                            if (
                                Number.parseFloat(scheduleDuration) >
                                lastMessageMaxOptionTime
                            ) {
                                lastMessageMaxOptionTime =
                                    Number.parseFloat(scheduleDuration);
                            }
                        }
                    });

                    var countdownTo = new Date(lastMessage?.deliveryDate);

                    countdownTo.setSeconds(
                        countdownTo.getSeconds() +
                            parseInt(lastMessageMaxOptionTime || 0)
                    );

                    const isScheduleEnded = new Date() > countdownTo;

                    setDelayInputNeeded(!isScheduleEnded);
                }
            }
        }
    };

    useEffect(() => {
        setInterval(() => {
            getLastMssgScheduledOptionTime();
        }, 1000);
    }, [ticketsMessages, ticketId, messages, delayInputNeeded]);

    const inputNeededTimer = () => {
        document.onvisibilitychange = () => {
            if (document.visibilityState === "visible") {
                showNotificationIcon(false);
            }
        };

        return setInterval(() => {
            handleInputNeeded();
        }, 120000);
    };

    useEffect(() => {
        let timer = "";

        if (!delayInputNeeded) {
            timer = inputNeededTimer();
        }

        return () => {
            clearInterval(timer);
        };
    }, [ticketsMessages, ticketId, messages, delayInputNeeded]);

    return (
        <>
            {!showVerifyForm ? (
                <div>
                    <TicketsHeader
                        {...{
                            ticket,
                            setStatus,
                            setErrorMssg,
                            requestAllMessages,
                            setActiveConvo,
                            handleCloseTicket,
                        }}
                    />
                    <div className='chat__interface'>
                        <LiveChatStatusBar
                            status={status}
                            agent={agent}
                            errorMssg={errorMssg}
                        />
                        <MessageBody
                            forcedAgentTyping={forcedAgentTyping}
                            messages={messages}
                            ticketId={ticketId}
                            agent={agent}
                            handleMessageOptionSelect={
                                handleMessageOptionSelect
                            }
                            handleOptConversation={handleOptConversation}
                            handleRateConversation={handleRateConversation}
                            handleVerifyAction={handleVerifyAction}
                            setActiveConvo={setActiveConvo}
                            requestAllMessages={requestAllMessages}
                            mssgOptionLoading={mssgOptionLoading}
                        />
                    </div>
                </div>
            ) : (
                <CustomerVerification
                    customer={customer}
                    handleVerifyAction={handleVerifyAction}
                    messages={messages}
                />
            )}
            <div
                className={`chat__input__container ${
                    showVerifyForm ? "live-chat-input__add-email" : ""
                }`}>
                <LiveChatInput
                    ticketId={ticketId}
                    inputType={currentInputType}
                    currentFormElement={currentFormElement}
                    handleNewMessage={handleNewMessage}
                    fetchingInputStatus={fetchingInputStatus}
                    allowUserInput={allowUserInput}
                    triggerAgentTyping={triggerAgentTyping}
                    showVerifyForm={showVerifyForm}
                    handleScrollChatToBottom={handleScrollChatToBottom}
                />{" "}
                {/* {reminderCount !== null && (
                    <Favicon
                        url={`https://proxy.cors.sh/${companyLogo}`}
                        animated={true}
                        alertCount={undefined}
                        // key={reminderCount}
                        // keepIconLink={() => reminderCount === null}
                    />
                )} */}
            </div>
        </>
    );
};

export default React.memo(LiveChat);

import React, { useEffect, useState, useContext, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import API from "lib/api";
import apiRoutes from "lib/api/apiRoutes";
import { SocketContext } from "lib/socket/context/socket";
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
    TICKET_PHASE_CHANGE,
} from "lib/socket/events";
import { dataQueryStatus } from "utils/formatHandlers";
import {
    generateID,
    getErrorMessage,
    incrementDateTime,
    isDeviceMobileTablet,
    validateEmail,
} from "utils/helper";
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
} from "store/tickets/actions";
import { ISSUE_DISCOVERY } from "components/Chat/CustomerTicketsContainer/CustomerTickets/common/TicketStatus/enum";
import CustomerVerification from "./CustomerVerification/CustomerVerification";
import { useFaviconNotification } from "react-favicon-notification";
import "./LiveChat.scss";
import { getConvoBreakers } from "storage/localStorage";
import {
    getConversationData,
    storeConversationData,
} from "storage/sessionStorage";
import envConfig from "../../../../config/config";
import { retriveAccessToken } from "storage/sessionStorage";
import { isLiveApp } from "config/config";

const NO_ACTION = "NO_ACTION";
const SMART_CONVOS = "smartConvos";
const { THIRD_USER, WORKSPACE_AGENT } = appMessageUserTypes;
const { LOADING, ERROR, DATAMODE, IDLE } = dataQueryStatus;
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

const { TEXT, DATE } = formInputTypes;

const LiveChat = ({
    getCustomerTickets,
    showVerifyForm,
    handleVerifyAction,
    handleCloseTicket,
    handleTicketCloseSuccess,
    handleOpenNewTicket,
    reconnectUser,
    verifyUserAction,
}) => {
    const [status, setStatus] = useState(LOADING);
    const [activeConvo, setActiveConvo] = useState(false);
    const [errorMssg, setErrorMssg] = useState("");
    const [forcedAgentTyping, triggerAgentTyping] = useState();
    const [allowUserInput, setAllowUserInput] = useState(false);
    const [currentInputType, setCurrentInputType] = useState(TEXT);
    const [currentFormElement, setCurrentFormElement] = useState();

    const [mssgSendStatus, setMssgSendStatus] = useState();

    const [fetchingInputStatus, setFetchingInputStatus] = useState(true);
    const [config, setConfig] = useFaviconNotification();

    const { activeTicket: ticket } = useSelector((state) => state.tickets);

    const [delayInputNeeded, setDelayInputNeeded] = useState(false);

    const [uploads, updateUploads] = useState([]);
    const [disableForm, setDisableForm] = useState(false);

    const {
        chatSettings: { workspaceId, workspaceSlug, hasWebHookEnabled },
    } = useSelector((state) => state.chat);

    const { ticketId, agent, ticketPhase, customer, conversationId } = ticket;

    const { ticketsMessages } = useSelector((state) => state.tickets);
    const messages = ticketsMessages?.filter(
        (item) => item?.ticketId === ticketId
    );
    const { user } = useSelector((state) => state?.auth);
    const userToken = retriveAccessToken();
    const isValidUserEmail = validateEmail(user?.email);

    const socket = useContext(SocketContext);
    const dispatch = useDispatch();

    const getConvoBreaker = (actionBranchType) => {
        const convoBreakerPrefix = isLiveApp
            ? window.location.host.includes("metacare")
                ? window.location.host?.split(".")[0]
                : window.location.host
            : workspaceSlug;

        const conversationBreakers = getConvoBreakers(convoBreakerPrefix);
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

                await dispatch(setTicketMessages(messagesArr));
                await handleConversationLinkMessages(messagesArr, {
                    ticketId,
                    conversationId,
                });
            }
        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
            if (err.response?.data?.code === "TICKET_CLOSED") {
                dispatch(setActiveTicket());
                getCustomerTickets(null, false);
            }
        }
    };
    console.log({ messages });
    const handleIssueDiscovery = async (convo) => {
        try {
            const lastMessage = messages[messages.length - 1];

            if (
                lastMessage.senderType === WORKSPACE_AGENT &&
                lastMessage.messageId !== SMART_CONVOS
            ) {
                return "";
            }
            console.log({ convo });
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
                console.log(discovered);
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

                    const allMessagesCopy = messages;

                    if (
                        allMessagesCopy?.length === 2 ||
                        ticketPhase !== ISSUE_DISCOVERY
                    ) {
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
                    }

                    socket.emit(SEND_AGENT_TICKET, {
                        ticketId,
                        workspaceId,
                    });

                    sendAgentTicket();

                    if (
                        allMessagesCopy?.length === 3 ||
                        ticketPhase !== ISSUE_DISCOVERY
                    ) {
                        handleAddEmail();
                    }
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

        const {
            conversationId,
            branchOptionId,
            branchOptionLabel,
            isIssueDiscoveryOption,
        } = convo;
        console.log("inside convo opt", { convo, ticket });

        if (branchOptionId === ADD_EMAIL_ADDRESS && !hasWebHookEnabled) {
            return handleVerifyAction();
        }

        setMssgSendStatus(LOADING);

        dispatch(
            updateTicketMessageStatus({
                messageId: SMART_CONVOS,
                ticketId,
                selectedOption: branchOptionId,
                messageStatus: messageStatues?.SENDING,
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
                    messageStatus: messageStatues?.SENDING,
                })
            );

            handleAddEmail();
        } else {
            const allMessagesCopy = messages;
            let lastCustomerMssg = [...allMessagesCopy]
                .reverse()
                ?.find((message) => message.senderType === THIRD_USER);

            const sendCustomerReply = await socket.timeout(30000).emit(
                SEND_CUSTOMER_CONVERSATION_REPLY,
                {
                    ticketId,
                    conversationId,
                    convoInitedBy: lastCustomerMssg?.messageContent,
                    message: branchOptionLabel,
                    isIssueDiscoveryOption,
                },
                (error) => {
                    if (error && sendCustomerReply?.connected === false) {
                        setMssgSendStatus(ERROR);
                        dispatch(
                            updateTicketMessageStatus({
                                messageId: SMART_CONVOS,
                                ticketId,
                                selectedOption: null,
                                messageStatus: messageStatues?.FAILED,
                            })
                        );
                    }
                }
            );
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

        if (branchOptionId === ADD_EMAIL_ADDRESS && !hasWebHookEnabled) {
            return handleVerifyAction();
        }

        setStatus(DATAMODE);
        setErrorMssg();
        setMssgSendStatus(LOADING);

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

        const sendBranchOption = await socket.timeout(30000).emit(
            SEND_BRANCH_OPTION,
            {
                ticketId,
                branchId,
                branchOptionId,
                message: branchOptionLabel,
            },
            (error) => {
                if (error && sendBranchOption?.connected === false) {
                    triggerAgentTyping(false);
                    setMssgSendStatus(ERROR);

                    const freshMessageList = messages.map((x) => {
                        return x.messageContentId === branchId
                            ? { ...x, selectedOption: "" }
                            : x;
                    });

                    dispatch(setTicketMessages(freshMessageList));
                }
            }
        );

        triggerAgentTyping(false);
    };

    const handleSocketError = () => {
        setErrorMssg("Tap to Refresh");
        setStatus(ERROR);
    };

    const handleSocketConnect = () => {
        setStatus(DATAMODE);
        setErrorMssg();
    };

    const handleReconnectUser = () => {
        setStatus(LOADING);
        reconnectUser();
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
                        setCurrentFormElement();
                    } else {
                        shouldAllowUserInput = false;
                        userInputType = TEXT;
                        setCurrentFormElement();
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

    const handleNewMessage = async (request, clearUserInput) => {
        let { message, fileAttachments, messageId } = request;

        // if (messages?.length === 1) {
        //     // only strip off at investigation stage
        //     message = message?.replace?.(/[^\w ]/g, "");
        // }

        if (messages?.length === 1) {
            triggerAgentTyping(true);
        }

        const newMessageId = generateID();
        setMssgSendStatus(LOADING);
        if (currentFormElement) {
            setDisableForm(true);
            const { order, formId, formElementId } = currentFormElement;
            const sendFormRecord = await socket.timeout(30000).emit(
                FILL_FORM_RECORD,
                {
                    ticketId,
                    message: message,
                    currentFormOrder: order,
                    formElementId,
                    formId,
                    fileAttachments,
                    messageStatus: messageStatues?.SENDING,
                },
                (error) => {
                    if (error && sendFormRecord?.connected === false) {
                        setMssgSendStatus(ERROR);
                        dispatch(
                            updateTicketMessageStatus({
                                ticketId,
                                messageId: messageId ? messageId : newMessageId,
                                messageStatus: messageStatues?.FAILED,
                            })
                        );
                        return;
                    } else {
                        clearUserInput?.();
                    }
                }
            );
        } else {
            const messageEntry = {
                ticketId,
                senderType: THIRD_USER,
                messageContent: message,
                messageContentId: messageId ? messageId : newMessageId,
                messageId: messageId ? messageId : newMessageId,
                messageType: DEFAULT,
                fileAttachments,
                messageStatus: messageStatues?.SENDING,
            };

            dispatch(saveTicketsMessages(messageEntry));

            const sendCustomerMessage = await socket.timeout(30000).emit(
                SEND_CUSTOMER_MESSAGE,
                {
                    ticketId,
                    message,
                    messageType: DEFAULT,
                    fileAttachments,
                },
                (error) => {
                    if (error && sendCustomerMessage?.connected === false) {
                        setMssgSendStatus(ERROR);
                        dispatch(
                            updateTicketMessageStatus({
                                ticketId,
                                messageId: messageId ? messageId : newMessageId,
                                messageStatus: messageStatues?.FAILED,
                            })
                        );
                        return;
                    } else {
                        clearUserInput?.();
                    }
                }
            );
        }

        // --- clear input if it is at investigate message stage ---
        if (messages?.length <= 3) {
            clearUserInput?.();
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

            const url = apiRoutes?.investigateMesage;
            const res = await API.get(url, {
                params: {
                    search: messageContent.trim(),
                },
            });

            setMssgSendStatus();
            if (res.status === 200) {
                const { data } = res.data;
                triggerAgentTyping(false);

                const messageEntry = {
                    ticketId,
                    ...message,
                    messageStatus: messageStatues?.DELIVERED,
                };

                dispatch(updateTicketMessageStatus(messageEntry));

                if (data.length > 0) {
                    const compMessageId = SMART_CONVOS;
                    let messageOptions = data?.map(
                        ({ conversationId, issueName }) => ({
                            branchOptionId: conversationId,
                            branchOptionLabel: issueName,
                            conversationId,
                            parentMessageId: compMessageId,
                            isIssueDiscoveryOption: true,
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
                const messageEntry = {
                    ticketId,
                    ...message,
                    messageStatus: messageStatues?.FAILED,
                };

                dispatch(updateTicketMessageStatus(messageEntry));
                triggerAgentTyping(false);
            }
        } catch (err) {
            const messageEntry = {
                ticketId,
                ...message,
                messageStatus: messageStatues?.FAILED,
            };

            dispatch(updateTicketMessageStatus(messageEntry));
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

        let lastAgentMssg = [...allMessagesCopy]
            .reverse()
            ?.find((message) => message.senderType === WORKSPACE_AGENT);

        if (
            (allMessagesCopy?.length === 2 ||
                lastAgentMssg?.messageType === DEFAULT) &&
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

            setMssgSendStatus();
        }
    };

    const handleMarkAsRead = async (messageId) => {
        await socket.emit(MARK_AS_READ, {
            messageId,
        });
    };

    const handleAddEmail = () => {
        if (!validateEmail(user?.email) && !hasWebHookEnabled) {
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

            triggerAgentTyping(false);

            if (actionBranchType === AGENT_FOLLOWUP) {
                sendAgentTicket();
                triggerAgentTyping(false);
            }
        }

        if (messageType === FORM_FILLED_COMPLETELY) {
            sendAgentTicket();
            triggerAgentTyping(false);

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

        // clearUserInput();
        setMssgSendStatus(SUCCESS);
        setDisableForm(false);
        if (senderType === THIRD_USER && messageType !== DEFAULT) {
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

        // triggerAgentTyping(false);
    };

    const handleAgentUnavailable = () => {
        setMssgSendStatus();

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

    const handleError = (eventData) => {};

    const handleTicketPhaseChange = (data) => {
        dispatch(setActiveTicket(JSON.parse(data)));
    };

    const handleConversationLinkMessages = async (messages, ticket) => {
        const conversationData = getConversationData();

        if (
            ticket?.ticketId !== conversationData?.ticketId &&
            ticket?.conversationId !== conversationData?.conversationId &&
            ticket?.conversationId &&
            messages?.length === 0
        ) {
            triggerAgentTyping(true);
            setAllowUserInput(false);

            await socket.timeout(30000).emit(
                SEND_CUSTOMER_CONVERSATION_REPLY,
                {
                    ticketId: ticket?.ticketId,
                    conversationId: ticket?.conversationId,
                },
                (error) => {
                    triggerAgentTyping(false);
                    // if (error && sendCustomerReply?.connected === false) {
                    //     setMssgSendStatus(ERROR);
                    //     dispatch(
                    //         updateTicketMessageStatus({
                    //             messageId: SMART_CONVOS,
                    //             ticketId,
                    //             selectedOption: null,
                    //             messageStatus: messageStatues?.FAILED,
                    //         })
                    //     );
                    // }
                }
            );
        }

        storeConversationData(ticket);
    };

    useEffect(() => {
        requestAllMessages();
        socket.emit(SUBSCRIBE_TO_TICKET, { ticketId });
        socket.on(RECEIVE_MESSAGE, handleReceive);
        // socket.on(CLOSED_TICKET, handleTicketClosureProvision)
        socket.on(NEW_TICKET_UPDATE, handleTicketClosure);
        socket.on(TICKET_PHASE_CHANGE, handleTicketPhaseChange);
        socket.on(AGENT_IS_UNAVAILABLE, handleAgentUnavailable);
        // socket.on(CLOSED_TICKET, handleTicketClosure);

        socket.on("connect_error", handleSocketError);
        socket.on("connect", handleSocketConnect);
        socket.on("error", handleError);

        return () => {
            socket.off(RECEIVE_MESSAGE);
            socket.off(NEW_TICKET_UPDATE);
            dispatch(clearThirdUserMessage(ticketId));
            // socket.off(CLOSED_TICKET)

            triggerAgentTyping(false);
            setActiveConvo(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

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
        if (
            messages?.length === 1 &&
            messages[0]?.messageType !== ACTION_INFO
        ) {
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
                    lastMessage?.branchOptions?.forEach(
                        ({ scheduleDuration }) => {
                            if (scheduleDuration) {
                                if (
                                    Number.parseFloat(scheduleDuration) >
                                    lastMessageMaxOptionTime
                                ) {
                                    lastMessageMaxOptionTime =
                                        Number.parseFloat(scheduleDuration);
                                }
                            }
                        }
                    );

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
        // eslint-disable-next-line
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
        // eslint-disable-next-line
    }, [ticketsMessages, ticketId, messages, delayInputNeeded]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();

            if (
                "serviceWorker" in navigator &&
                navigator.serviceWorker.controller
            ) {
                const tag = "close-ticket";

                navigator.serviceWorker.controller.postMessage({
                    tag,
                    ticketId,
                    baseUrl: envConfig?.apiGateway?.BASE_URL,
                    apiKey: envConfig?.apiGateway?.CLIENT_KEY,
                    token: userToken,
                });
            }
        };

        if (!isValidUserEmail) {
            window.addEventListener("beforeunload", handleBeforeUnload);
        }

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
        //eslint-disable-next-line
    }, []);

    const { formElementType } = currentFormElement || {};

    const isDateFormElement = formElementType === DATE;

    const handleUploads = (data) => {
        updateUploads(data);

        if (data?.length > 0) {
            setMssgSendStatus(IDLE);
        }
    };

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
                            reconnectUser={handleReconnectUser}
                            handleAddEmailAction={handleVerifyAction}
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
                            handleNewMessage={handleNewMessage}
                            status={status}
                            mssgSendStatus={mssgSendStatus}
                            isValidUserEmail={isValidUserEmail}
                        />
                    </div>
                </div>
            ) : (
                <CustomerVerification
                    customer={customer}
                    handleVerifyAction={handleVerifyAction}
                    messages={messages}
                    verifyUserAction={verifyUserAction}
                    ticketId={ticketId}
                />
            )}
            <div
                className={`chat__input__container  ${
                    isDateFormElement ? "chat__input__high__index" : ""
                } ${showVerifyForm ? "live-chat-input__add-email" : ""}`}>
                <LiveChatInput
                    ticketId={ticketId}
                    inputType={currentInputType}
                    currentFormElement={currentFormElement}
                    handleNewMessage={handleNewMessage}
                    fetchingInputStatus={fetchingInputStatus}
                    allowUserInput={allowUserInput && status !== LOADING}
                    triggerAgentTyping={triggerAgentTyping}
                    showVerifyForm={showVerifyForm}
                    handleScrollChatToBottom={handleScrollChatToBottom}
                    disableInput={
                        status === LOADING || status === ERROR || disableForm
                    }
                    uploads={uploads}
                    updateUploads={handleUploads}
                    isDateFormElement={isDateFormElement}
                    mssgSendStatus={mssgSendStatus}
                    messages={messages}
                />
            </div>
        </>
    );
};

export default React.memo(LiveChat);

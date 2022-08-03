import React, { useEffect, useState, useContext, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import API from "../../../../lib/api";
import apiRoutes from "../../../../lib/api/apiRoutes";
import { SocketContext } from "../../../../lib/socket/context/socket";
import {
    FILL_FORM_RECORD,
    SEND_BRANCH_OPTION,
    SEND_CUSTOMER_CONVERSATION_REPLY,
    SEND_CUSTOMER_MESSAGE,
    NEW_TEST_TICKET
} from "../../../../lib/socket/events";
import { dataQueryStatus } from "../../../../utils/formatHandlers";
import { generateID, getErrorMessage } from "../../../../utils/helper";
import LiveChatInput from "./LiveChatInput/LiveChatInput";
import LiveChatStatusBar from "./LiveChatStatusBar/LiveChatStatusBar";
import MessageBody from "./MessageBody/MessageBody";
import {
    appMessageUserTypes,
    branchOptionsTypes,
    formInputTypes,
    messageOptionActions,
    messageStatues,
    messageTypes,
} from "./MessageBody/Messages/Message/enums";
import TicketsHeader from "../TicketsHeader/TicketsHeader";
import { ISSUE_DISCOVERY } from "../../CustomerTicketsContainer/CustomerTickets/common/TicketStatus/enum";
import {
    setActiveTicket,
    saveTicketsMessages,
    clearTicketMessages,
    setTicketMessages,
    updateTicketMessageStatus,
} from "../../../../store/tickets/actions";
const { THIRD_USER, WORKSPACE_AGENT } = appMessageUserTypes;
const { LOADING, ERROR, DATAMODE } = dataQueryStatus;

const { DEFAULT, BRANCH, FORM_REQUEST, CONVERSATION, BRANCH_OPTION } =
    messageTypes;

const { TEXT } = formInputTypes;
const LiveChat = ({ getCustomerTickets }) => {
    const [status, setStatus] = useState(LOADING);
    const [activeConvo, setActiveConvo] = useState(false);
    const [errorMssg, setErrorMssg] = useState("");
    const [forcedAgentTyping, triggerAgentTyping] = useState();

    const [allowUserInput, setAllowUserInput] = useState(false);
    const [currentInputType, setCurrentInputType] = useState(TEXT);
    const [currentFormElement, setCurrentFormElement] = useState();
    const [showUndoChoice, setUndoChoiceVisibility] = useState();

    const [fetchingInputStatus, setFetchingInputStatus] = useState(true);
    const { activeTicket: ticket } = useSelector((state) => state.tickets);

    const { ticketId, agent, ticketPhase } = ticket;
    const { ticketsMessages } = useSelector((state) => state.tickets);
    const messages = ticketsMessages?.filter(
        (item) => item?.ticketId === ticketId
    );

    const socket = useContext(SocketContext);
    const dispatch = useDispatch();

    const figureChoiceAction = () => {
        const messagesCopy = messages;
        let recentCustomerMssg = [...messagesCopy]
            .reverse()
            ?.find(
                (message) =>
                    message.senderType === appMessageUserTypes?.THIRD_USER
            );
        const showOrHide = recentCustomerMssg?.messageType === BRANCH_OPTION;
        setUndoChoiceVisibility(showOrHide);
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
                const messagesArr = data.map((x) => ({
                    ...x,
                    ticketId,
                    suggestionRetryAttempt: 0,
                    messageStatus: messageStatues?.DELIVERED,
                }));
                dispatch(setTicketMessages(messagesArr));
            }
        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    };

    const handleOptConversation = async (convo) => {
        const {
            parentMessageId,
            conversationId,
            branchOptionId,
            branchOptionLabel,
        } = convo;

        let newMessageList = await messages.map((x) => {
            return x.messageContentId === parentMessageId
                ? { ...x, selectedOption: branchOptionId }
                : x;
        });
        newMessageList = [
            ...newMessageList,
            {
                ticketId,
                senderType: THIRD_USER,
                messageContent: branchOptionLabel,
                messageContentId: branchOptionId,
                messageType: BRANCH_OPTION,
            },
        ];

        dispatch(setTicketMessages(newMessageList));
        triggerAgentTyping(true);

        socket.emit(NEW_TEST_TICKET, { ticketId });
        socket
            .timeout(1000)
            .emit(
                SEND_CUSTOMER_CONVERSATION_REPLY,
                { ticketId, conversationId },
                (err) => {
                    if (err) {
                        triggerAgentTyping(false);
                        // const freshMessageList = (messages).map((x) => {
                        //     return x.messageContentId === parentMessageId ? { ...x, selectedOption: "" } : x
                        // })
                        console.log("Encountered error");
                    } else {
                        triggerAgentTyping(false);
                    }
                }
            );
    };

    const handleMessageOptionSelect = async (messageOption) => {
        const {
            branchId,
            branchOptionId,
            branchOptionType,
            branchOptionLabel,
            branchOptionValue,
            branchOptionActionType,
        } = messageOption;
        setStatus(DATAMODE);
        setErrorMssg();
        // return ""branchOptionActionType

        let newMessageList = await messages.map((x) => {
            return x.messageType === messageTypes?.BRANCH &&
                x.messageContentId === branchId
                ? { ...x, selectedOption: branchOptionId }
                : x;
        });

        newMessageList = [
            ...newMessageList,
            {
                ticketId,
                senderType: THIRD_USER,
                messageContent: branchOptionLabel,
                messageContentId: branchOptionId,
                messageType: BRANCH_OPTION,
            },
        ];

        dispatch(setTicketMessages(newMessageList));

        if (branchOptionType === branchOptionsTypes?.LINK) {
            window && window.open(branchOptionValue, "_blank").focus();
        }

        if (
            branchOptionActionType === messageOptionActions?.CLOSE_CONVERSATION
        ) {
            handleCloseConversation();
            return "";
        }

        if (
            branchOptionActionType ===
            messageOptionActions?.RESTART_CONVERSATION
        ) {
            restartConversation();
            return "";
        }
        // triggerAgentTyping(true)

        await socket.timeout(2000).emit(
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
                    console.log("Encountered error");
                } else {
                    // triggerAgentTyping(false)
                }
            }
        );
        // triggerAgentTyping(false)
        // await setTimeout(function () {
        //     triggerAgentTyping(false)
        // }, 5000);
    };

    const handleSocketError = () => {
        setErrorMssg("could not connect to chat");
        setStatus(ERROR);
    };

    const figureInputAction = () => {
        setFetchingInputStatus(true);
        let shouldAllowUserInput = true;
        let userInputType = "";
        const messageCopy = messages;
        let recentAdminMessage = [...messageCopy]
            .reverse()
            ?.find((message) => message.senderType === WORKSPACE_AGENT);
        if (recentAdminMessage) {
            const { messageType, branchOptions, form } = recentAdminMessage;
            switch (messageType) {
                case DEFAULT:
                    shouldAllowUserInput = true;
                    userInputType = TEXT;
                    break;
                case BRANCH:
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

    const handleNewMessage = async (message) => {
        if (currentFormElement) {
            const { order, formId, formElementId } = currentFormElement;
            dispatch(
                saveTicketsMessages({
                    ticketId,
                    messageContent: message,
                    senderType: THIRD_USER,
                    messageContentId: generateID(),
                    messageType: messageTypes?.FORM_RESPONSE,
                })
            );
            socket.timeout(5000).emit(FILL_FORM_RECORD, {
                ticketId,
                message,
                currentFormOrder: order,
                formElementId,
                formId,
            });
        } else {
            const newMessageId = generateID();
            const messageEntry = {
                ticketId,
                senderType: THIRD_USER,
                messageContent: message,
                messageContentId: newMessageId,
                messageType: DEFAULT,
                messageStatus: messageStatues?.SENDING,
                suggestionRetryAttempt: 0,
            };
            dispatch(saveTicketsMessages(messageEntry));

            await socket
                .timeout(1000)
                .emit(
                    SEND_CUSTOMER_MESSAGE,
                    { ticketId, message, messageType: DEFAULT },
                    async (err) => {
                        if (err) {
                            // setStatus(ERROR);
                            // setErrorMssg('Message not sent successfully');
                            dispatch(
                                updateTicketMessageStatus({
                                    ...messageEntry,
                                    messageStatus: messageStatues?.DELIVERED,
                                })
                            );
                        } else {
                            dispatch(
                                updateTicketMessageStatus({
                                    ...messageEntry,
                                    messageStatus: messageStatues?.DELIVERED,
                                })
                            );
                            // dispatch(updateTicketMessageStatus({ ticketId, messageId: newMessageId, messageStatus: messageStatues?.DELIVERED }))
                        }
                    }
                );
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
                dispatch(setActiveTicket());
                getCustomerTickets();
            }
        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    };

    const restartConversation = async () => {
        try {
            setStatus(LOADING);
            setErrorMssg();
            const url = apiRoutes?.restartTicket(ticketId);
            const res = await API.post(url);
            if (res.status === 201) {
                setStatus(DATAMODE);
                const { ticketId } = res.data.data;
                dispatch(setActiveTicket());
                getCustomerTickets(ticketId);
            }
        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    };

    const fetchConvoSuggestions = async (message) => {
        try {
            console.log("Got called here to");
            const { messageContent, messageContentId } = message;

            const newMessageList = await messages.map((x) => {
                return x.messageContentId === messageContentId
                    ? { ...x, suggestionRetryAttempt: 2 }
                    : x;
            });
            triggerAgentTyping(true);

            dispatch(setTicketMessages(newMessageList));

            const url = apiRoutes?.investigateMesage;
            const res = await API.get(url, {
                params: {
                    search: messageContent.trim(),
                },
            });
            if (res.status === 200) {
                const { data } = res.data;
                const compMessageId = "smartConvos";
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
                        branchOptionId: "NO_ACTION",
                        parentMessageId: compMessageId,
                    },
                ];
                let newMessage = {
                    messageContentId: compMessageId,
                    messageContent:
                        "Are any of these relevant to the problem you’re having?",
                    messageType: CONVERSATION,
                    branchOptions: messageOptions,
                    senderType: WORKSPACE_AGENT,
                    selectedOption: "",
                };
                if (data.length > 0) {
                    // handleReceive(newMessage);
                    dispatch(
                        saveTicketsMessages({
                            ...newMessage,
                            ticketId,
                        })
                    );

                    setActiveConvo(true);
                } else {
                    setActiveConvo(false);
                }
                triggerAgentTyping(false);
            } else {
                triggerAgentTyping(false);
            }
        } catch (err) {
            console.log(err);
            triggerAgentTyping(false);
            setActiveConvo(false);
        }
    };

    const processIssueDiscovery = useCallback(() => {
        // console.log('AN active convo', activeConvo)
        const allMessagesCopy = messages;
        if (activeConvo) {
            return "";
        } else {
            const lastItemIndex = allMessagesCopy.length - 1;
            const lastMessage = messages[lastItemIndex];
            let lastCustomerMssg = [...allMessagesCopy]
                .reverse()
                ?.find((message) => message.senderType === THIRD_USER);
            if (
                lastCustomerMssg?.messageType === DEFAULT &&
                lastMessage.messageType !== CONVERSATION &&
                ticketPhase === ISSUE_DISCOVERY &&
                lastCustomerMssg?.suggestionRetryAttempt === 0
            ) {
                fetchConvoSuggestions(lastCustomerMssg);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages, activeConvo, ticketPhase]);

    const handleReceive = (message) => {
        if (message.senderType === WORKSPACE_AGENT) {
            triggerAgentTyping(false);
            dispatch(
                saveTicketsMessages({
                    ...message,
                    ticketId,
                })
            );
        }
    };

    useEffect(() => {
        requestAllMessages();

        socket.emit("subscribe-to-ticket", { ticketId });
        socket.on("receive-message", handleReceive);
        socket.on("connect_error", handleSocketError);
        return () => {
            socket.off("receive-message");
            dispatch(clearTicketMessages(ticketId));
            triggerAgentTyping(false);
            setActiveConvo(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        figureChoiceAction();
        figureInputAction();
        processIssueDiscovery();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages]);

    return (
        <>
            <TicketsHeader
                {...{
                    ticket,
                    setStatus,
                    setErrorMssg,
                    requestAllMessages,
                    showUndoChoice,
                    setActiveConvo,
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
                    handleMessageOptionSelect={handleMessageOptionSelect}
                    handleOptConversation={handleOptConversation}
                />
            </div>
            <div className='chat__input__container'>
                <LiveChatInput
                    ticketId={ticketId}
                    inputType={currentInputType}
                    currentFormElement={currentFormElement}
                    handleNewMessage={handleNewMessage}
                    fetchingInputStatus={fetchingInputStatus}
                    allowUserInput={allowUserInput}
                    triggerAgentTyping={triggerAgentTyping}
                />
            </div>
        </>
    );
};

export default React.memo(LiveChat);

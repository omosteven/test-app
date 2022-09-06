import React, { useEffect, useState, useContext, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import API from "../../../../lib/api";
import apiRoutes from "../../../../lib/api/apiRoutes";
import { SocketContext } from "../../../../lib/socket/context/socket";
import {
    CLOSED_TICKET,
    FILL_FORM_RECORD,
    NEW_TICKET_UPDATE,
    RECEIVE_MESSAGE,
    SEND_BRANCH_OPTION,
    SEND_CUSTOMER_CONVERSATION_REPLY,
    SEND_CUSTOMER_MESSAGE,
    SUBSCRIBE_TO_TICKET,
} from "../../../../lib/socket/events";
import { dataQueryStatus } from "../../../../utils/formatHandlers";
import { generateID, getErrorMessage } from "../../../../utils/helper";
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
} from "./MessageBody/Messages/enums";
import TicketsHeader from "../TicketsHeader/TicketsHeader";
import {
    setActiveTicket,
    saveTicketsMessages,
    setTicketMessages,
    updateTicketMessageStatus,
    deleteTicketsMessages,
} from "../../../../store/tickets/actions";
import { ISSUE_DISCOVERY } from "components/Chat/CustomerTicketsContainer/CustomerTickets/common/TicketStatus/enum";

const NO_ACTION = "NO_ACTION";
const SMART_CONVOS = "smartConvos";
const { THIRD_USER, WORKSPACE_AGENT } = appMessageUserTypes;
const { LOADING, ERROR, DATAMODE } = dataQueryStatus;

const { DEFAULT, BRANCH, FORM_REQUEST, CONVERSATION, BRANCH_OPTION, ACTION_INFO } =
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

    const [fetchingInputStatus, setFetchingInputStatus] = useState(true);
    const { activeTicket: ticket } = useSelector((state) => state.tickets);

    const { ticketId, agent, ticketPhase } = ticket;
    const { ticketsMessages } = useSelector((state) => state.tickets);
    const messages = ticketsMessages?.filter(
        (item) => item?.ticketId === ticketId
    );

    const socket = useContext(SocketContext);
    const dispatch = useDispatch();

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
                }));

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
           
            if (lastMessage.senderType === WORKSPACE_AGENT && lastMessage.messageId !== SMART_CONVOS) {
                return "";
            }

            // triggerAgentTyping(true);

            const { branchOptionId, branchOptionLabel } = convo;
            const discovered = branchOptionId === NO_ACTION;
            const url = apiRoutes?.updateTicketDiscovery(ticketId);

            const res = await API.get(url, {
                params: {
                    discovered
                }
            })
            if (res.status === 200) {
                // triggerAgentTyping(false);

                if (discovered) {
                    dispatch(
                        saveTicketsMessages({
                            ticketId,
                            messageId: NO_ACTION,
                            messageRefContent: branchOptionLabel,
                            messageContent: `This usually takes about two (2) minutes, please hold on`,
                            messageType: ACTION_INFO,
                            messageActionType: AGENT_FOLLOWUP,
                            senderType: WORKSPACE_AGENT,
                            deliveryDate: new Date().toISOString()
                        })
                    );
                }
            }
        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
            // triggerAgentTyping(false);
        }
    }

    const handleOptConversation = async (convo) => {
        // triggerAgentTyping(true);

        const {
            conversationId,
            branchOptionId,
            branchOptionLabel,
        } = convo;

        dispatch(updateTicketMessageStatus({ messageId: SMART_CONVOS, ticketId, selectedOption: branchOptionId }));
        if (branchOptionId === NO_ACTION ){
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
        } else {
            await socket.timeout(1000).emit(SEND_CUSTOMER_CONVERSATION_REPLY, { ticketId, conversationId, message: branchOptionLabel });
        }

        handleIssueDiscovery(convo);
    };

    const handleMessageOptionSelect = async (messageOption) => {
        const newMessageId = generateID();
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
            return (x.messageType === messageTypes?.BRANCH ||
                x.messageType === messageTypes?.COLLECTION ||
                x.messageType === messageTypes?.BRANCH_OPTION ||
                x.messageType === messageTypes?.BRANCH_SUB_SENTENCE ||
                x.messageType === messageTypes?.CONVERSATION ||
                x.messageType === messageTypes?.COLLECTION) &&
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
                messageId: newMessageId,
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
        triggerAgentTyping(true);

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
        setErrorMssg("Trying to connect to chat");
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

                case ACTION_INFO:
                case CONVERSATION:
                    shouldAllowUserInput = false;
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

    const handleNewMessage = async (request) => {
        const { message, fileAttachments } = request;
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
            socket.emit(
                SEND_CUSTOMER_MESSAGE,
                {
                    ticketId,
                    message: message,
                    messageType: DEFAULT,
                    fileAttachments,
                },
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
                        deliveryDate: new Date().toISOString()
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
                    handleIssueDiscovery({ branchOptionId: NO_ACTION, branchOptionLabel: messageContent })
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
            lastCustomerMssg?.messageType === DEFAULT &&
            lastMessage.messageType !== CONVERSATION && lastMessage.messageType !== ACTION_INFO
            && ticketPhase === ISSUE_DISCOVERY
        ) {
            fetchConvoSuggestions(lastCustomerMssg);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages, activeConvo, ticketPhase]);

    const handleTicketClosure = (ticket) => {
        console.log("so what ")
        console.log(ticket)
    }

    const handleReceive = (message) => {
        const {ticketId} = message?.ticket;
        if (message.senderType === WORKSPACE_AGENT) {
            triggerAgentTyping(false)
            dispatch(deleteTicketsMessages({ messageId: NO_ACTION, ticketId }))

        }
        dispatch(
            saveTicketsMessages({
                ...message,
                ticketId,
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
            })
        );
    };

    useEffect(() => {
        requestAllMessages();

        socket.emit(SUBSCRIBE_TO_TICKET, { ticketId });
        socket.on(RECEIVE_MESSAGE, handleReceive);
        socket.on(NEW_TICKET_UPDATE, handleTicketClosure);
        // socket.on(CLOSED_TICKET, handleTicketClosure);
        
        socket.on("connect_error", handleSocketError);
        return () => {
            socket.off(RECEIVE_MESSAGE);
            socket.off(NEW_TICKET_UPDATE);
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
    }, [messages]);

    return (
        <>
            <TicketsHeader
                {...{
                    ticket,
                    setStatus,
                    setErrorMssg,
                    requestAllMessages,
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

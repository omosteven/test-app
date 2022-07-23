import React, { useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
import API from "../../../../lib/api";
import apiRoutes from "../../../../lib/api/apiRoutes";
import { SocketContext } from "../../../../lib/socket/context/socket";
import { FILL_FORM_RECORD, SEND_BRANCH_OPTION, SEND_CUSTOMER_CONVERSATION_REPLY, SEND_CUSTOMER_MESSAGE } from "../../../../lib/socket/events";
import { dataQueryStatus } from "../../../../utils/formatHandlers";
import { generateID, getErrorMessage } from "../../../../utils/helper";
import LiveChatInput from "./LiveChatInput/LiveChatInput";
import LiveChatStatusBar from "./LiveChatStatusBar/LiveChatStatusBar";
import MessageBody from "./MessageBody/MessageBody";
import { appMessageUserTypes, branchOptionsTypes, formInputTypes, messageOptionActions, messageTypes } from "./MessageBody/Messages/Message/enums";
import TicketsHeader from "../TicketsHeader/TicketsHeader";
import { ISSUE_DISCOVERY } from "../../CustomerTicketsContainer/CustomerTickets/common/TicketStatus/enum";
import { useRenderCounter } from "../../../../utils/hooks";
import { setActiveTicket,  deleteTicketsMessages, saveTicketsMessages, clearTicketMessages } from "../../../../store/tickets/actions";
const { THIRD_USER, WORKSPACE_AGENT } = appMessageUserTypes;
const { LOADING, ERROR, DATAMODE } = dataQueryStatus;

const { DEFAULT, BRANCH, FORM_REQUEST, CONVERSATION, BRANCH_OPTION } = messageTypes;

const { TEXT } = formInputTypes
const LiveChat = ({ ticket, getCustomerTickets }) => {
    const [status, setStatus] = useState(LOADING);
    const [activeConvo, setActiveConvo] = useState(false)
    const [errorMssg, setErrorMssg] = useState("");
    const [forcedAgentTyping, triggerAgentTyping] = useState()

    const [allowUserInput, setAllowUserInput] = useState(false);
    const [currentInputType, setCurrentInputType] = useState(TEXT)
    const [currentFormElement, setCurrentFormElement] = useState();
    const [showUndoChoice, setUndoChoiceVisibility] = useState();

    const [fetchingInputStatus, setFetchingInputStatus] = useState(true);
    const { ticketId, agent, ticketPhase } = ticket;
    const [messages, setMessages] = useState([]);

    const socket = useContext(SocketContext);
    const dispatch = useDispatch();

    const figureChoiceAction = () => {
        const messagesCopy = messages;
        let recentCustomerMssg = [...messagesCopy].reverse()?.find(message => message.senderType === appMessageUserTypes?.THIRD_USER);
        const showOrHide = recentCustomerMssg?.messageType === BRANCH_OPTION;
        setUndoChoiceVisibility(showOrHide)
    }

    const requestAllMessages = async () => {
        try {
            setStatus(LOADING);
            setErrorMssg();
            const url = apiRoutes?.getTicketMessages(ticketId);
            const res = await API.get(url);
            if (res.status === 200) {
                setStatus(DATAMODE);
                const { data } = res.data;
                setMessages(data);
            }

        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    }


    const handleOptConversation = async (convo) => {
        const {parentMessageId, conversationId} = convo
        const newMessageList = await (messages).map((x) => {
            return x.messageContentId === parentMessageId ? { ...x, selectedOption: conversationId } : x
        })
        setMessages(newMessageList)
        triggerAgentTyping(true)

        // await setTimeout(function () {
            socket.timeout(1000).emit(SEND_CUSTOMER_CONVERSATION_REPLY, { ticketId, conversationId }, (err) => {
                if (err) {
                    triggerAgentTyping(false)
                    // const freshMessageList = (messages).map((x) => {
                    //     return x.messageContentId === parentMessageId ? { ...x, selectedOption: "" } : x
                    // })
                    console.log("Encountered error")
                    // setMessages(freshMessageList)
                } else {
                    triggerAgentTyping(false)
                }

            });
        // }, 5000);

    }

    const handleMessageOptionSelect = async (messageOption) => {
        const { branchId, branchOptionId, branchOptionType, branchOptionLabel, branchOptionValue, branchOptionActionType } = messageOption;
        setStatus(DATAMODE);
        setErrorMssg();
        // return ""branchOptionActionType

        const newMessageList = await (messages).map((x) => {
            return x.messageType === messageTypes?.BRANCH && x.messageContentId === branchId ? { ...x, selectedOption: branchOptionId } : x
        })
        setMessages(newMessageList)

        if (branchOptionType === branchOptionsTypes?.LINK){
            window && window.open(branchOptionValue, '_blank').focus();
        }

        if (branchOptionActionType === messageOptionActions?.CLOSE_CONVERSATION) {
            handleCloseConversation()
            // break
            return "";
        }

        if (branchOptionActionType === messageOptionActions?.RESTART_CONVERSATION) {
            restartConversation()
            return "";
        }
        triggerAgentTyping(true)

        await socket.timeout(2000).emit(SEND_BRANCH_OPTION, {
            ticketId,
            branchId,
            branchOptionId,
            message: branchOptionLabel,
        },  (err) => {
            if (err) {
                triggerAgentTyping(false)
                // const freshMessageList = (messages).map((x) => {
                //     return x.messageContentId === parentMessageId ? { ...x, selectedOption: "" } : x
                // })
                console.log("Encountered error")
                // setMessages(freshMessageList)
            } else {
                triggerAgentTyping(false)
            }

        })
        // triggerAgentTyping(false)
        // await setTimeout(function () {
        //     triggerAgentTyping(false)
        // }, 5000);

    };

    const handleSocketError = () => {
        setErrorMssg('could not connect to chat');
        setStatus(ERROR);
    };

    const figureInputAction = () => {
        setFetchingInputStatus(true)
        let shouldAllowUserInput = true;
        let userInputType = "";
        const messageCopy = messages;
        let recentAdminMessage = [...messageCopy].reverse()?.find(message => message.senderType === WORKSPACE_AGENT);
        if (recentAdminMessage) {
            const { messageType, branchOptions, form } = recentAdminMessage;
            switch (messageType) {
                case DEFAULT:
                    shouldAllowUserInput = true
                    userInputType = TEXT
                    break;
                case BRANCH:
                    if (branchOptions?.length > 0) {
                        shouldAllowUserInput = false
                        userInputType = TEXT
                        setCurrentFormElement();
                    } else {
                        shouldAllowUserInput = true
                        userInputType = TEXT
                        setCurrentFormElement();
                    }
                    break;
                case FORM_REQUEST:
                    if (form) {
                        const { formElement, formId } = form || {}
                        setCurrentFormElement({ ...formElement, formId });
                        shouldAllowUserInput = true
                        userInputType = formElement?.formElementType
                    } else {
                        setCurrentFormElement();
                        shouldAllowUserInput = true
                        userInputType = TEXT
                    }
                    break;
                default:
                    shouldAllowUserInput = true
                    userInputType = TEXT
                    setCurrentFormElement();
                    break;
            }
        }
        setAllowUserInput(shouldAllowUserInput)
        setCurrentInputType(userInputType)
        setFetchingInputStatus(false)
    }


    const handleNewMessage = async (message) => {
        if (currentFormElement) {
            const { order, formId, formElementId } = currentFormElement;
            dispatch(saveTicketsMessages({
                ticketId,
                messageContent: message,
                messageId: formElementId,
                messageType: DEFAULT,
            }));
            socket.timeout(5000).emit(FILL_FORM_RECORD, { ticketId, message, currentFormOrder: order, formElementId, formId }, async (err) => {
                if (err) {
                    dispatch(deleteTicketsMessages({
                        ticketId,
                        formElementId
                    }))
                    setStatus(ERROR);
                    setErrorMssg('Unable to send Reply');
                } else {
                    dispatch(deleteTicketsMessages({
                        ticketId,
                        formElementId
                    }))
                }
            });
        } else {

            const newMessageId = generateID();
            dispatch(saveTicketsMessages({
                ticketId,
                messageContent: message,
                messageId: newMessageId,
                messageType: DEFAULT,
            }));
            await socket.timeout(10000).emit(SEND_CUSTOMER_MESSAGE, { ticketId, message, messageType: DEFAULT }, (err) => {
                if (err) {
                    setStatus(ERROR);
                    setErrorMssg('Message not sent successfully');
                    dispatch(deleteTicketsMessages({
                        ticketId,
                        newMessageId
                    }))
                } else {
                    dispatch(deleteTicketsMessages({
                        ticketId,
                        newMessageId
                    }))
                }

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
                dispatch(setActiveTicket())
                getCustomerTickets()

            }

        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    }

    const restartConversation = async () => {
        try {
            setStatus(LOADING);
            setErrorMssg();
            const url = apiRoutes?.restartTicket(ticketId);
            const res = await API.post(url);
            if (res.status === 201) {
                setStatus(DATAMODE);
                const { ticketId } = res.data.data;
                dispatch(setActiveTicket())
                getCustomerTickets(ticketId)
            }

        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    }

    const fetchConvoSuggestions = async (message) => {
        try {
            triggerAgentTyping(true);
            setActiveConvo(true)

            const url = apiRoutes?.investigateMesage;
            const res = await API.get(url, {
                params: {
                    search: message
                }
            });
            if (res.status === 200) {
                const { data } = res.data;
                triggerAgentTyping(false);
                const compMessageId = generateID();
                const messageOptions = data?.map(({ conversationId, conversationTitle }) => ({ branchOptionId: conversationId, branchOptionLabel: conversationTitle, conversationId, parentMessageId: compMessageId }))
                let newMessage = {
                    messageContentId: compMessageId,
                    messageContent: "Are any of these relevant to the problem you’re having?",
                    messageType: CONVERSATION,
                    branchOptions: messageOptions,
                    senderType: WORKSPACE_AGENT,
                    selectedOption: ""
                }
                if (data.length > 0) {
                    handleReceive(newMessage);
                }
            }

        } catch (err) {
            triggerAgentTyping(false);
            setActiveConvo(false)
        }
    }


    const processIssueDiscovery = () => {
        const allMessagesCopy = messages;
        let recentCustomerMessage = [...allMessagesCopy].reverse()?.find(message => message.senderType === THIRD_USER);
        console.log('Recent Customer Message')
        console.log(recentCustomerMessage)
        console.log(ticketPhase)
        console.log(activeConvo)
        console.log(recentCustomerMessage?.messageType === DEFAULT && ticketPhase === ISSUE_DISCOVERY)
        if (recentCustomerMessage?.messageType === DEFAULT && ticketPhase === ISSUE_DISCOVERY && activeConvo === false) {
            console.log("Even got here")
            const { messageContent } = recentCustomerMessage;
            const lastItemIndex = allMessagesCopy.length - 1;
            const lastMessage = messages[lastItemIndex];
            if (lastMessage.messageType !== CONVERSATION ){
                console.log('perform discovery')
                console.log(messageContent?.trim())
                fetchConvoSuggestions(messageContent);
            }
        }
    }

    const handleReceive = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    }

    useEffect(() => {
        requestAllMessages();
        socket.emit("subscribe-to-ticket", { ticketId });
        socket.on("receive-message", handleReceive);
        socket.on("connect_error", handleSocketError);
        return () => {
            socket.off("receive-message");
            dispatch(clearTicketMessages(ticketId))
        };
    }, []);

    useEffect(() => {
        figureChoiceAction();
        figureInputAction()
        processIssueDiscovery();
    }, [messages])

    // var last_element = my_array[my_array.length - 1];
    const renderCount = useRenderCounter('Live chat');

    return (
        <>
            <span>{renderCount}</span>
            <TicketsHeader
                {
                ...{
                    ticket,
                    setStatus,
                    setErrorMssg,
                    requestAllMessages,
                    showUndoChoice
                }
                }
            />
            <div className='chat__interface'>
                <LiveChatStatusBar status={status} agent={agent} errorMssg={errorMssg} />
                <MessageBody
                    forcedAgentTyping={forcedAgentTyping}
                    messages={messages}
                    ticketId={ticketId}
                    agent={agent}
                    handleMessageOptionSelect={handleMessageOptionSelect}
                    handleOptConversation={handleOptConversation}
                />
            </div>
            <LiveChatInput
                ticketId={ticketId}
                inputType={currentInputType}
                currentFormElement={currentFormElement}
                handleNewMessage={handleNewMessage}
                fetchingInputStatus={fetchingInputStatus}
                allowUserInput={allowUserInput}
                triggerAgentTyping={triggerAgentTyping}
            />
        </>
    );
};

export default React.memo(LiveChat);

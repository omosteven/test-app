import { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../../../../../lib/socket/context/socket";
import { IS_NOT_TYPING, IS_TYPING } from "../../../../../../lib/socket/events";
import TypingMessageIndicator from "../../../../../ui/TypingMessage/TypingMessage";
import { appMessageUserTypes } from "./Message/enums";
import SuggestedMessage from "./SuggestedMessage/SuggestedMessage";
import Message from "./Message/Message";


const Messages = (props) => {
    const { messages, agent, ticketId, forcedAgentTyping, handleMessageOptionSelect, handleOptConversation } = props;
    const {  activeTicket } = useSelector(state => state.tickets)
    const { agentTyping, ticketsMessages} = activeTicket || {};
    const [agentIsTyping, sayAgentIsTyping] = useState(agentTyping)
    const socket = useContext(SocketContext);
    const suggestedMessages = ticketsMessages?.filter((item) => item?.ticketId === ticketId);


    const handleTypingTrigger = (data) => {
        const {typing, user} = data;
        const {userType} = user
        // remove first condition later
        console.log("Typing triggered", typing)
        if (!userType || userType === appMessageUserTypes?.WORKSPACE_AGENT){
            sayAgentIsTyping(typing)
        }
    }

    useEffect(() => {
        console.log(props)
    }, [])

    useEffect(() => {
        console.log('re rendered')
        socket.on(IS_TYPING, handleTypingTrigger)
        socket.on(IS_NOT_TYPING, handleTypingTrigger)
    }, [])

    useEffect(() => {
        sayAgentIsTyping(forcedAgentTyping)
    }, [forcedAgentTyping, sayAgentIsTyping])

    return (
        <div className="d-content">
            {messages?.map((message, i) => (
                <Message
                    key={i}
                    messageIndex={i+1}
                    messagesDepth={messages?.length}
                    data={message}
                    agent={agent}
                    handleMessageOptionSelect={handleMessageOptionSelect}
                    handleOptConversation={handleOptConversation}
                />
            ))}
              <>
                {
                    suggestedMessages?.length > 0 &&
                    <>
                        {
                            suggestedMessages?.map((message, index) => (
                                <SuggestedMessage
                                    key={index}
                                    data={message}
                                />
                            ))
                        }
                    </>
                }
            </>
            {agentIsTyping && <TypingMessageIndicator
                {
                    ...{
                        agent,
                        forcedAgentTyping
                    }
                }
            />}
            <div id="dummy"></div>
        </div>
    );
};

export default Messages;

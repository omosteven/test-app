import { useState, useEffect, useContext } from "react";
import { AnimatePresence } from 'framer-motion'
import { useSelector } from "react-redux";
import { SocketContext } from "../../../../../../lib/socket/context/socket";
import { IS_NOT_TYPING, IS_TYPING } from "../../../../../../lib/socket/events";
import TypingMessageIndicator from "../../../../../ui/TypingMessage/TypingMessage";
import { appMessageUserTypes } from "./Message/enums";
import MessageDemo from "../../MessageDemo/MessageDemo";

const Messages = (props) => {
    const { agent, ticketId, forcedAgentTyping, handleMessageOptionSelect, handleOptConversation } = props;
    const { activeTicket, ticketsMessages } = useSelector(state => state.tickets)
    const messages = ticketsMessages?.filter((item) => item?.ticketId === ticketId);
    const { agentTyping } = activeTicket || {};
    const [agentIsTyping, sayAgentIsTyping] = useState(agentTyping)
    const socket = useContext(SocketContext);

    const handleTypingTrigger = (data) => {
        const { typing, user } = data;
        const { userType } = user
        if (userType === appMessageUserTypes?.WORKSPACE_AGENT) {
            sayAgentIsTyping(typing)
        }
    }

    useEffect(() => {
        console.log('re rendered')
        socket.on(IS_TYPING, handleTypingTrigger)
        socket.on(IS_NOT_TYPING, handleTypingTrigger)
        //e
    }, [])

    useEffect(() => {
        sayAgentIsTyping(forcedAgentTyping)
    }, [forcedAgentTyping, sayAgentIsTyping])

    return (
        <div className="d-content">
            <AnimatePresence>
                {messages?.length > 0 ?
                    <MessageDemo
                        messages={messages}
                        agent={agent}
                        handleMessageOptionSelect={handleMessageOptionSelect}
                        handleOptConversation={handleOptConversation} />
                : ""}
            </AnimatePresence>

                {agentIsTyping ? <TypingMessageIndicator
                    {
                    ...{
                        agent,
                        forcedAgentTyping
                    }
                    }
                /> : ""}
                <div id="dummy"></div>
        </div>
    );
};

export default Messages;

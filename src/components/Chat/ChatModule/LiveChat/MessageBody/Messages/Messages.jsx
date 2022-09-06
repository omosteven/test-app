import { useState, useEffect, useContext } from "react";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { SocketContext } from "../../../../../../lib/socket/context/socket";
import { IS_NOT_TYPING, IS_TYPING } from "../../../../../../lib/socket/events";
import TypingMessageIndicator from "../../../../../ui/TypingMessage/TypingMessage";
import { appMessageUserTypes } from "./enums";
import MessagesLayout from "./MessagesLayout/MessagesLayout";

const Messages = (props) => {
    const {
        agent,
        ticketId,
        forcedAgentTyping,
        handleMessageOptionSelect,
        handleOptConversation,
        openPreviewModal,
    } = props;
    const { activeTicket, ticketsMessages } = useSelector(
        (state) => state.tickets
    );
    const messages = ticketsMessages?.filter(
        (item) => item?.ticketId === ticketId
    );
    const { agentTyping } = activeTicket || {};
    const [agentIsTyping, sayAgentIsTyping] = useState(agentTyping);
    const socket = useContext(SocketContext);

    const handleTypingTrigger = (data) => {
        const { typing, user } = data;
        const { userType } = user;
        if (userType === appMessageUserTypes?.WORKSPACE_AGENT) {
            sayAgentIsTyping(typing);
        }
    };

    useEffect(() => {
        socket.on(IS_TYPING, handleTypingTrigger);
        socket.on(IS_NOT_TYPING, handleTypingTrigger);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        sayAgentIsTyping(forcedAgentTyping);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [forcedAgentTyping, sayAgentIsTyping]);

    return (
        <div className='d-content'>
            <AnimatePresence>
                {messages?.length > 0 ? (
                    <MessagesLayout
                        messages={messages}
                        agent={agent}
                        handleMessageOptionSelect={handleMessageOptionSelect}
                        handleOptConversation={handleOptConversation}
                        openPreviewModal={openPreviewModal}
                    />
                ) : (
                    ""
                )}
            </AnimatePresence>

            {agentIsTyping ? (
                <TypingMessageIndicator
                    {...{
                        agent,
                        forcedAgentTyping,
                    }}
                />
            ) : (
                ""
            )}
            <div id='dummy'></div>
        </div>
    );
};

export default Messages;

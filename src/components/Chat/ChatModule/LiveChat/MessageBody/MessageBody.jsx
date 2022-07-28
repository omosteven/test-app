import React, { useCallback, useEffect } from "react";
import Messages from "./Messages/Messages";
import { useSelector } from "react-redux";

const MessageBody = ({ forcedAgentTyping, handleMessageOptionSelect, handleOptConversation }) => {

    const { activeTicket: ticket, ticketsMessages: messages } = useSelector(state => state.tickets)
    const { ticketId, agent } = ticket;

    const ID = 'messageBody';
    const _autoScroll = useCallback(() => {
        try {
            document.getElementById('dummy').scrollIntoView({ behavior: 'smooth', block: 'end' });
        } catch (err) {
            console.log('error scrolling')
        }
    }, [])

    
    useEffect(() => {
        _autoScroll()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages])

    return (
        <div className='message-body scroll' id={ID}>
            <Messages
                messages={messages}
                agent={agent}
                ticketId={ticketId}
                forcedAgentTyping={forcedAgentTyping}
                handleMessageOptionSelect={handleMessageOptionSelect}
                handleOptConversation={handleOptConversation}
            />
        </div>
    );
};

export default React.memo(MessageBody);

// export default MessageBody;

import React from 'react';
import { AgentImage } from '../AgentImage/AgentImage';
import ChatBubble from '../animate/ChatBubble';

const TypingMessageIndicator = ({ agent }) => {
    const { displayPicture, firstName } = agent;
    
    return (
        <ChatBubble>
        <div
            className={`d-flex align-items-center mb-3 message__group receive`}>
            <AgentImage src={displayPicture} alt={firstName} />
            <div
                className={`d-flex flex-column w-100 align-items-start`}>
                <div
                    className={`message__content received`}>
                    <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
        </ChatBubble>

    );
};


export default TypingMessageIndicator;
import React from 'react';
import { AgentImage } from '../AgentImage/AgentImage';
import ChatBubble from '../animate/ChatBubble';

const TypingMessageIndicator = ({ agent }) => {
    const { displayPicture, firstName } = agent;

    return (
        <ChatBubble>
            <div
                className={`message__group receive`}>
                <AgentImage src={displayPicture} alt={firstName} />
                <div
                    className={`message__group--content`}>
                    <div
                        className={`message__content received`}>
                        <div className="message">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ChatBubble>

    );
};


export default TypingMessageIndicator;
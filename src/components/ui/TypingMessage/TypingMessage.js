import React from 'react';
import { AgentImage } from '../AgentImage/AgentImage';

const TypingMessageIndicator = ({ agent }) => {
    const { displayPicture, firstName } = agent;
    
    return (
        <div
            className={`d-flex gap-2 align-items-center mb-3 message__group receive`}>
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

    );
};


export default TypingMessageIndicator;
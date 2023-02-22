import React from "react";
import { useSelector } from "react-redux";
import { AgentImage } from "../AgentImage/AgentImage";
import ChatBubble from "../animate/ChatBubble";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import "./TypingMessageIndicator.scss";

const { WORKMODE } = defaultTemplates;

const TypingMessageIndicator = ({ agent }) => {
    const { defaultTemplate } = useSelector(
        (state) => state?.chat?.chatSettings
    );

    const { displayPicture, firstName } = agent;

    return (
        <ChatBubble>
            <div
                className={`d-flex align-items-center mb-3 typing__indicator__group`}>
                {defaultTemplate === WORKMODE && (
                    <AgentImage src={displayPicture} alt={firstName} />
                )}
                <div className={`d-flex flex-column w-100 align-items-start`}>
                    <div className={`typing__content received`}>
                        <div className='typing-indicator'>
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

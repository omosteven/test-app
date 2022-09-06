import React from "react";
import { AgentImage } from "../../../../../../ui";
import MessageContent from "../Message/MessageContent/MessageContent";
import ActionMessageContent from "./ActionMessageContent/ActionMessageContent";


const ActionMessage = ({
    data,
    agent,
}) => {

    const { messageRefContent, messageId, messageContent, messageActionType } = data
    const { displayPicture, firstName } = agent || {};


    return (
        <div
            id={messageId ? messageId : ""}
            className={`message__group received`}>
            <AgentImage src={displayPicture} alt={firstName} />
            <div
                className={`message__group--content `}>
                <MessageContent
                    isReceivedMessage={false}
                    messageContent={messageRefContent}
                    otherClassNames={'grayed__out'}
                />

                <ActionMessageContent
                    messageContent={messageContent}
                    messageActionType={messageActionType}
                />

            </div>
        </div>
    );
};


export default ActionMessage;
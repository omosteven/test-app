import React from "react";
import { AgentImage } from "../../../../../../ui";
import MessageContent from "../Message/MessageContent/MessageContent";
import ActionMessageContent from "./ActionMessageContent/ActionMessageContent";

const ActionMessage = ({ data, agent, handleRating, handleVerifyAction }) => {
    const { messageRefContent, messageId, messageContent, messageActionType } =
        data;
    const { displayPicture, firstName } = agent || {};

    return (
        <div
            id={messageId ? messageId : ""}
            className={`message__group received`}>
            <AgentImage src={displayPicture} alt={firstName} />
            <div className={`message__group--content `}>
                {messageRefContent && (
                    <MessageContent
                        isReceivedMessage={false}
                        messageContent={messageRefContent}
                        otherClassNames={"grayed__out"}
                    />
                )}

                <ActionMessageContent
                    messageContent={messageContent}
                    messageActionType={messageActionType}
                    handleRating={handleRating}
                    handleVerifyAction={handleVerifyAction}
                />
            </div>
        </div>
    );
};

export default ActionMessage;

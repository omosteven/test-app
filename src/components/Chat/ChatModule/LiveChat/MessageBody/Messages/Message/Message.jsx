import React from "react";
import { appMessageUserTypes } from "./enums";
import { AgentImage } from "../../../../../../ui";
import MessageOptions from "./MessageOptions/MessageOptions";
import MessageContent from "./MessageContent/MessageContent";

const Message = ({ data, agent, handleMessageOptionSelect, handleOptConversation, messageIndex, messagesDepth }) => {
    const { senderType, messageType, messageStatus, branchOptions, messageContent, messageContentId, selectedOption } = data || {};
    const { displayPicture, firstName } = agent || {};

    const isReceivedMessage =
        senderType === appMessageUserTypes.WORKSPACE_AGENT;

    return (
        <div
            id={messageContentId ? messageContentId : ""}
            className={`message__group ${isReceivedMessage ? "receive" : "send text-end"
                }`}>
            {isReceivedMessage && (
                <AgentImage src={displayPicture} alt={firstName} />
            )}
            <div
                className={`d-flex flex-column w-100 ${isReceivedMessage ? "" : "align-items-end"
                    }`}>
                <MessageContent
                    isReceivedMessage={isReceivedMessage}
                    messageContent={messageContent}
                    messageStatus={messageStatus}
                />
                {
                    branchOptions?.length > 0 && (
                        <MessageOptions
                            selectedOption={selectedOption}
                            options={branchOptions}
                            messageIndex={messageIndex}
                            messagesDepth={messagesDepth}
                            messageType={messageType}
                            handleMessageOptionSelect={handleMessageOptionSelect}
                            handleOptConversation={handleOptConversation}
                        />
                    )}
                {/* <span className='text-secondary'>Message seen 1:2pm</span> */}
            </div>
        </div>
    );
};
export default Message;

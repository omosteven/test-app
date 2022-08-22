import React from "react";
import { appMessageUserTypes } from "./enums";
import { AgentImage } from "../../../../../../ui";
import MessageAttachments from "./MessageAttachments/MessageAttachments";
import MessageOptions from "./MessageOptions/MessageOptions";
import MessageContent from "./MessageContent/MessageContent";
import MessageTimeStatus from "./MessageTimeStatus/MessageTimeStatus";

const Message = ({
    data,
    agent,
    handleMessageOptionSelect,
    handleOptConversation,
    messageIndex,
    messagesDepth,
    openPreviewModal,
}) => {
    const {
        senderType,
        messageType,
        branchOptions,
        messageContent,
        messageId,
        selectedOption,
        fileAttachments,
        readDate,
        deliveryDate,
    } = data || {};

    const parsedBranchOption =
        typeof branchOptions === "string"
            ? JSON.parse(branchOptions)
            : branchOptions;

    const { displayPicture, firstName } = agent || {};

    const isReceivedMessage =
        senderType === appMessageUserTypes.WORKSPACE_AGENT;

    return (
        <div
            id={messageId ? messageId : ""}
            className={`message__group ${isReceivedMessage ? "received" : "sent"
                }`}>
            {isReceivedMessage && (
                <AgentImage src={displayPicture} alt={firstName} />
            )}
            <div
                className={`message__group--content `}>
                {messageContent !== "" && (
                    <MessageContent
                        isReceivedMessage={isReceivedMessage}
                        messageContent={messageContent}
                        fileAttachments={fileAttachments}
                        openPreviewModal={openPreviewModal}
                    />
                )}
                {parsedBranchOption?.length > 0 && (
                    <MessageOptions
                        selectedOption={selectedOption}
                        options={parsedBranchOption}
                        messageIndex={messageIndex}
                        messagesDepth={messagesDepth}
                        messageType={messageType}
                        handleMessageOptionSelect={handleMessageOptionSelect}
                        handleOptConversation={handleOptConversation}
                    />
                )}

                <MessageTimeStatus
                    date={isReceivedMessage ? readDate : deliveryDate} />
            </div>
        </div>
    );
};
export default Message;

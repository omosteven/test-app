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
        messageContentId,
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
            id={messageContentId ? messageContentId : ""}
            className={`message__group ${
                isReceivedMessage ? "receive" : "send text-end"
            }`}>
            {isReceivedMessage && (
                <AgentImage src={displayPicture} alt={firstName} />
            )}
            <div
                className={`d-flex flex-column w-100 ${
                    isReceivedMessage ? "" : "align-items-end"
                }`}>
                {fileAttachments?.length > 0 && (
                    <MessageAttachments
                        fileAttachments={fileAttachments}
                        openPreviewModal={openPreviewModal}
                    />
                )}
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
                {!isReceivedMessage ? (
                    <MessageTimeStatus date={readDate} />
                ) : (
                    <MessageTimeStatus date={deliveryDate} />
                )}
            </div>
        </div>
    );
};
export default Message;

import React from "react";
import { AgentImage } from "../../../../../../ui";
import MessageOptions from "./MessageOptions/MessageOptions";
import MessageContent from "./MessageContent/MessageContent";
import MessageTimeStatus from "./MessageTimeStatus/MessageTimeStatus";
import { messageTypes, appMessageUserTypes } from "../enums";

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

    const parsedBranchOptions =
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
                <MessageContent
                    isReceivedMessage={isReceivedMessage}
                    messageContent={messageContent}
                    fileAttachments={fileAttachments}
                    openPreviewModal={openPreviewModal}
                />
                {parsedBranchOptions?.length > 0 && (
                    <MessageOptions
                        selectedOption={selectedOption}
                        options={parsedBranchOptions}
                        messageIndex={messageIndex}
                        messagesDepth={messagesDepth}
                        messageType={messageType}
                        handleMessageOptionSelect={handleMessageOptionSelect}
                        handleOptConversation={handleOptConversation}
                    />
                )}

                {messageType !== messageTypes?.BRANCH_SUB_SENTENCE && <MessageTimeStatus
                    date={isReceivedMessage ? readDate : deliveryDate} />
                }
            </div>
        </div>
    );
};
export default Message;

import React from "react";
import { useSelector } from "react-redux";
import { AgentImage } from "components/ui";
import MessageOptions from "./MessageOptions/MessageOptions";
import MessageContent from "./MessageContent/MessageContent";
import MessageTimeStatus from "./MessageTimeStatus/MessageTimeStatus";
import { messageTypes, appMessageUserTypes } from "../enums";
import MessageAttachments from "./MessageAttachments/MessageAttachments";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import { INPUT_NEEDED } from "../enums";
import "./Message.scss";

const { WORK_MODE, RELAXED } = defaultTemplates;
const { BRANCH_SUB_SENTENCE, FORM_REQUEST } = messageTypes;
const { WORKSPACE_AGENT } = appMessageUserTypes;

const Message = ({
    data,
    agent,
    handleMessageOptionSelect,
    handleOptConversation,
    messageIndex,
    messagesDepth,
    openPreviewModal,
    messages,
    setActiveConvo,
    requestAllMessages,
}) => {
    const { defaultTemplate } = useSelector(
        (state) => state?.chat?.chatSettings
    );
    const lastMessage = messages[messages.length - 1];
    const immediatePreviousMessage = messages[messages.length - 2];

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

    const isReceivedMessage = senderType === WORKSPACE_AGENT;
    const hasAttachment = fileAttachments?.length > 0;

    const messageCopy = messages;
    const recentAdminMessage = [...messageCopy]
        .reverse()
        ?.find(
            (message) =>
                message?.messageActionType !== INPUT_NEEDED &&
                message?.senderType === WORKSPACE_AGENT
        );
    const showMessageOptions =
        (lastMessage?.messageActionType === INPUT_NEEDED &&
            recentAdminMessage?.messageId === messageId &&
            immediatePreviousMessage?.messageType !== FORM_REQUEST) ||
        messageIndex === messagesDepth;

    const isRelaxedTemplate = defaultTemplate === RELAXED;
    const isWorkModeTemplate = defaultTemplate === WORK_MODE;

    return (
        <div
            id={messageId ? messageId : ""}
            className={`message__group ${
                isReceivedMessage ? "received" : "sent"
            }`}>
            {isReceivedMessage && isWorkModeTemplate && (
                <AgentImage src={displayPicture} alt={firstName} />
            )}

            <div className={`message__group--content `}>
                {hasAttachment && (
                    <MessageAttachments
                        fileAttachments={fileAttachments}
                        openPreviewModal={openPreviewModal}
                        isReceivedMessage={isReceivedMessage}
                    />
                )}
                <MessageContent
                    isReceivedMessage={isReceivedMessage}
                    messageContent={messageContent}
                    fileAttachments={fileAttachments}
                    openPreviewModal={openPreviewModal}
                    messageType={messageType}
                    setActiveConvo={setActiveConvo}
                    requestAllMessages={requestAllMessages}
                    messageId={messageId}
                    messages={messages}
                    lastMessage={lastMessage}
                />
                {parsedBranchOptions?.length > 0 && isRelaxedTemplate ? (
                    showMessageOptions ? (
                        <MessageOptions
                            selectedOption={selectedOption}
                            options={parsedBranchOptions}
                            messageIndex={messageIndex}
                            messagesDepth={messagesDepth}
                            messageType={messageType}
                            handleMessageOptionSelect={
                                handleMessageOptionSelect
                            }
                            handleOptConversation={handleOptConversation}
                            deliveryDate={deliveryDate}
                            lastMessage={lastMessage}
                        />
                    ) : (
                        <></>
                    )
                ) : (
                    isWorkModeTemplate && (
                        <MessageOptions
                            selectedOption={selectedOption}
                            options={parsedBranchOptions}
                            messageIndex={messageIndex}
                            messagesDepth={messagesDepth}
                            messageType={messageType}
                            handleMessageOptionSelect={
                                handleMessageOptionSelect
                            }
                            handleOptConversation={handleOptConversation}
                            deliveryDate={deliveryDate}
                            lastMessage={lastMessage}
                        />
                    )
                )}
                {messageType !== BRANCH_SUB_SENTENCE ||
                    (!isRelaxedTemplate && (
                        <>
                            {isReceivedMessage ? (
                                <MessageTimeStatus date={readDate} />
                            ) : (
                                <MessageTimeStatus date={deliveryDate} />
                            )}
                        </>
                    ))}
            </div>
        </div>
    );
};

export default Message;

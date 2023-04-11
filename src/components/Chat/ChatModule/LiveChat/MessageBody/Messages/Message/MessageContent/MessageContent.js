import React, { useState } from "react";
import { useSelector } from "react-redux";
import { messageTypes, appMessageUserTypes, messageStatues } from "../../enums";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import ChangeOptionChoice from "./ChangeOptionChoice/ChangeOptionChoice";
import ChangeOptionChoiceModal from "./ChangeOptionChoice/ChangeOptionChoiceModal/ChangeOptionChoiceModal";

const { BRANCH_OPTION, FORM_REQUEST, ACTION_INFO, DEFAULT, CONVERSATION } =
    messageTypes;
const { THIRD_USER } = appMessageUserTypes;
const { RELAXED } = defaultTemplates;

const { DELIVERED, FAILED } = messageStatues;

const MessageContent = ({
    isReceivedMessage,
    messageContent,
    otherClassNames,
    messageType,
    setActiveConvo,
    requestAllMessages,
    messages,
    messageId,
    lastMessage,
    data,
    handleNewMessage,
    messageIndex,
}) => {
    const [showModal, toggleModal] = useState(false);
    const { defaultTemplate } = useSelector(
        (state) => state?.chat?.chatSettings
    );

    const isRelaxedTemplate = defaultTemplate === RELAXED;

    const handleChangeOptionChoiceModal = () => {
        toggleModal(!showModal);
    };

    const messageCopy = messages;

    const recentThirdUserMessage =
        messageCopy &&
        [...messageCopy]
            .reverse()
            ?.find(
                (message) =>
                    (messageType === BRANCH_OPTION ||
                        messageType === CONVERSATION) &&
                    message?.senderType === THIRD_USER
            );

    const showChangeOptionChoice =
        isRelaxedTemplate &&
        !isReceivedMessage &&
        (messageType === BRANCH_OPTION || messageType === CONVERSATION) &&
        recentThirdUserMessage?.messageId === messageId &&
        (lastMessage?.messageType !== ACTION_INFO ||
            lastMessage?.messageType !== FORM_REQUEST ||
            lastMessage?.messageType !== DEFAULT) &&
        messageIndex > 4;

    const handleRetry = () => {
        handleNewMessage({ ...data });
    };

    const { messageStatus } = data || {};

    const renderBasedOnMessageStatus = () => {
        switch (messageStatus) {
            // case SENDING:
            // return <SmallLoader otherClassName='message__group--sending' />;
            case DELIVERED:
                return "";

            case FAILED:
                return (
                    <p
                        className='message__group--error'
                        onClick={() => handleRetry()}>
                        Network connection failed. Tap to retry
                    </p>
                );
            default:
                return "";
        }
    };

    return (
        <>
            <div
                className={`
                message__content 
                ${isReceivedMessage ? "received" : "sent"}
                ${otherClassNames ? otherClassNames : ""}
            `}
                onClick={() =>
                    showChangeOptionChoice
                        ? handleChangeOptionChoiceModal()
                        : ""
                }>
                {messageContent !== "" && (
                    <div className='message'>{messageContent}</div>
                )}
            </div>
            {showChangeOptionChoice && (
                <ChangeOptionChoice onClick={handleChangeOptionChoiceModal} />
            )}
            {showModal && isRelaxedTemplate && (
                <ChangeOptionChoiceModal
                    show={showModal}
                    toggle={() => toggleModal(false)}
                    setActiveConvo={setActiveConvo}
                    requestAllMessages={requestAllMessages}
                />
            )}
            {!isReceivedMessage && messages?.length <= 2 && (
                <>{renderBasedOnMessageStatus()}</>
            )}
        </>
    );
};

export default MessageContent;

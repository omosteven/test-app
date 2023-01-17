import React, { useState } from "react";
import { useSelector } from "react-redux";
import { messageTypes, appMessageUserTypes } from "../../enums";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import ChangeOptionChoice from "./ChangeOptionChoice/ChangeOptionChoice";
import ChangeOptionChoiceModal from "./ChangeOptionChoice/ChangeOptionChoiceModal/ChangeOptionChoiceModal";

const { BRANCH_OPTION, FORM_REQUEST, ACTION_INFO, DEFAULT } = messageTypes;
const { THIRD_USER } = appMessageUserTypes;
const { RELAXED } = defaultTemplates;

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
                    message?.messageType === BRANCH_OPTION &&
                    message?.senderType === THIRD_USER
            );

    const showChangeOptionChoice =
        messageType === BRANCH_OPTION &&
        isRelaxedTemplate &&
        recentThirdUserMessage?.messageId === messageId &&
        (lastMessage?.messageType !== ACTION_INFO ||
            lastMessage?.messageType !== FORM_REQUEST ||
            lastMessage?.messageType !== DEFAULT);

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
        </>
    );
};

export default MessageContent;

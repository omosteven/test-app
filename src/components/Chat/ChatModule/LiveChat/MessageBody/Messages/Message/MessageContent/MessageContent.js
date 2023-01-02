import React, { useState } from "react";
import { useSelector } from "react-redux";
import { messageTypes } from "../../enums";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import ChangeOptionChoice from "./ChangeOptionChoice/ChangeOptionChoice";
import ChangeOptionChoiceModal from "./ChangeOptionChoice/ChangeOptionChoiceModal/ChangeOptionChoiceModal";

const { BRANCH_OPTION, FORM_REQUEST, ACTION_INFO, DEFAULT } = messageTypes;
const { RELAXED } = defaultTemplates;

const MessageContent = ({
    isReceivedMessage,
    messageContent,
    otherClassNames,
    messageType,
    messageIndex,
    messagesDepth,
    setActiveConvo,
    requestAllMessages,
    lastMessage,
}) => {
    const [showModal, toggleModal] = useState(false);
    const { defaultTemplate } = useSelector(
        (state) => state?.chat?.chatSettings
    );

    const handleChangeOptionChoiceModal = () => {
        toggleModal(!showModal);
    };

    const isRelaxedTemplate = defaultTemplate === RELAXED;
    const showChangeOptionChoice =
        messageType === BRANCH_OPTION &&
        isRelaxedTemplate &&
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
                    isRelaxedTemplate && messageIndex === messagesDepth
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

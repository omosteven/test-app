import React, { useCallback, useEffect, useState } from "react";
import Messages from "./Messages/Messages";
import { useSelector } from "react-redux";
import ModalPreview from "../ModalPreview/ModalPreview";
import "./MessageBody.scss";

const MessageBody = ({
    forcedAgentTyping,
    handleMessageOptionSelect,
    handleOptConversation,
    handleRateConversation,
    handleVerifyAction,
    messages,
    setActiveConvo,
    requestAllMessages,
    mssgOptionLoading,
}) => {
    const { activeTicket: ticket } = useSelector((state) => state.tickets);
    const { ticketId, agent } = ticket;

    const [showModal, toggleModal] = useState(false);
    const [preview, setPreview] = useState({
        fileAttachmentUrl: "",
        fileAttachmentType: "",
    });

    const openPreviewModal = (previewObject) => {
        setPreview(previewObject);
        toggleModal(true);
    };

    const closePreviewModal = () => {
        setPreview({ fileAttachmentUrl: "", fileAttachmentType: "" });
        toggleModal(false);
    };

    const ID = "messageBody";
    const _autoScroll = useCallback(() => {
        try {
            document
                .getElementById("dummy")
                .scrollIntoView({ behavior: "smooth", block: "end" });
        } catch (err) {}
    }, []);

    useEffect(() => {
        _autoScroll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages]);

    return (
        <div className='message-body scroll' id={ID}>
            <Messages
                messages={messages}
                agent={agent}
                ticketId={ticketId}
                forcedAgentTyping={forcedAgentTyping}
                handleMessageOptionSelect={handleMessageOptionSelect}
                handleOptConversation={handleOptConversation}
                openPreviewModal={openPreviewModal}
                handleRateConversation={handleRateConversation}
                handleVerifyAction={handleVerifyAction}
                setActiveConvo={setActiveConvo}
                requestAllMessages={requestAllMessages}
                mssgOptionLoading={mssgOptionLoading}
            />
            {showModal && (
                <ModalPreview
                    showModal={showModal}
                    toggleModal={() => closePreviewModal()}
                    preview={preview?.fileAttachmentUrl}
                    previewType={preview?.fileAttachmentType}
                />
            )}
        </div>
    );
};

export default React.memo(MessageBody);

// export default MessageBody;

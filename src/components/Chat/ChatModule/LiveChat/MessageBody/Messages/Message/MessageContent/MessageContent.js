import { messageStatues } from "../enums";
import MessageAttachments from "../MessageAttachments/MessageAttachments";

const MessageContent = ({
    isReceivedMessage,
    messageContent,
    fileAttachments,
    openPreviewModal
}) => {
    const hasAttachment = fileAttachments?.length > 0;
    return (
        <div
            className={`message__content ${isReceivedMessage ? "received" : "sent"} ${hasAttachment ? 'has__attachment' : ''}`}>
            {hasAttachment && (
                <MessageAttachments
                    fileAttachments={fileAttachments}
                    openPreviewModal={openPreviewModal}
                />
            )}
            <div className="message">{messageContent}</div>
        </div>
    );
};

export default MessageContent;

import MessageAttachments from "../MessageAttachments/MessageAttachments";

const MessageContent = ({
    isReceivedMessage,
    messageContent,
    fileAttachments,
    openPreviewModal,
    otherClassNames,
}) => {
    const hasAttachment = fileAttachments?.length > 0;
    return (
        <div
            className={`
                message__content 
                ${isReceivedMessage ? "received" : "sent"}
                ${hasAttachment ? "has__attachment" : ""}
                ${otherClassNames ? otherClassNames : ""}
            `}>
            {hasAttachment && (
                <MessageAttachments
                    fileAttachments={fileAttachments}
                    openPreviewModal={openPreviewModal}
                />
            )}
            <div className='message'>{messageContent}</div>
        </div>
    );
};

export default MessageContent;

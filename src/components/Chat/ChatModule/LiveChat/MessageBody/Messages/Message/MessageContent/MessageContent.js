const MessageContent = ({ isReceivedMessage, messageContent }) => {
    return (
        <div
            className={`message__content ${
                isReceivedMessage
                    ? "received"
                    : "sent"
            }`}>
            <span>{messageContent}</span>
        </div>
    );
};

export default MessageContent;

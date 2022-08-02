import { messageStatues } from "../enums"

const MessageContent = ({ isReceivedMessage, messageContent, messageStatus }) => {
    return (
        <div
            className={`message__content ${isReceivedMessage
                ? "received"
                : "sent"
                }
            ${messageStatus ? messageStatus === messageStatues?.SENDING ? "shiny__background"  : "" : ""}
            `}>
            <span>{messageContent}</span>
        </div>
    );
};

export default MessageContent;

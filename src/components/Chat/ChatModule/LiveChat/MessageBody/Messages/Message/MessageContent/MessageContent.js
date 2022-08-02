import { messageStatues } from "../enums";
import MediaContent from "./MediaContent/MediaContent";

const MessageContent = ({
    isReceivedMessage,
    messageContent,
    messageStatus,
    fileAttachments,
}) => {
    return (
        <div
            className={`message__content ${
                isReceivedMessage ? "received" : "sent"
            }
            ${
                messageStatus
                    ? messageStatus === messageStatues?.SENDING
                        ? "shiny__background"
                        : ""
                    : ""
            }
            `}>
            <div>
                {fileAttachments &&
                    fileAttachments?.map((attachment, i) => (
                        <MediaContent attachment={attachment} key={i} />
                    ))}
            </div>
            <span>{messageContent}</span>
        </div>
    );
};

export default MessageContent;

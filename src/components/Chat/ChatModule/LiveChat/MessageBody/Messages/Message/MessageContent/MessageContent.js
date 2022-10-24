import React from "react";

const MessageContent = ({
    isReceivedMessage,
    messageContent,
    otherClassNames,
}) => {
    return (
        <div
            className={`
                message__content 
                ${isReceivedMessage ? "received" : "sent"}
                ${otherClassNames ? otherClassNames : ""}
            `}>
            {messageContent !== "" && (
                <div className='message'>{messageContent}</div>
            )}
        </div>
    );
};

export default MessageContent;

import React from "react";
import MediaContent from "./MediaContent/MediaContent";
import "./MessageAttachments.scss";

const MessageAttachments = ({
    fileAttachments,
    openPreviewModal,
    isReceivedMessage,
}) => {
    return (
        <div className='attachment__list'>
            {fileAttachments &&
                fileAttachments?.map((attachment, i) => (
                    <MediaContent
                        attachment={attachment}
                        key={i}
                        openPreviewModal={openPreviewModal}
                        isReceivedMessage={isReceivedMessage}
                    />
                ))}
        </div>
    );
};

export default MessageAttachments;

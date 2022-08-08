import {
    IMAGE,
    FILE,
    VIDEO,
} from "../../../../../LiveChatInput/UploadIcons/enum";
import "./MediaContent.scss";

const MediaContent = ({ attachment, openPreviewModal }) => {
    const { fileAttachmentUrl, fileAttachmentType } = attachment || {};

    const renderBasedOnMediaType = () => {
        switch (fileAttachmentType) {
            case IMAGE:
                return (
                    <img
                        src={fileAttachmentUrl}
                        alt='media'
                        className='media img'
                        onClick={() => openPreviewModal(attachment)}
                    />
                );
            case FILE:
                return <>{fileAttachmentUrl} </>;
            case VIDEO:
                return (
                    <video
                        className='media'
                        controls
                        onClick={() => openPreviewModal(attachment)}>
                        <source src={fileAttachmentUrl} />
                    </video>
                );
        }
    };

    return <>{renderBasedOnMediaType()}</>;
};

export default MediaContent;

import {
    IMAGE,
    FILE,
    VIDEO,
} from "../../../../../LiveChatInput/UploadIcons/enum";
import { ReactSVG } from "react-svg";
import imageLinks from "../../../../../../../../../assets/images";
import "./MediaContent.scss";
import {
    getFileFormat,
    truncate,
} from "../../../../../../../../../utils/helper";
import MessageContent from "../../MessageContent/MessageContent";

const MediaContent = ({ attachment, openPreviewModal }) => {
    const {
        fileAttachmentUrl,
        fileAttachmentType,
        fileAttachmentName,
        fileAttachmentCaption,
    } = attachment || {};

    const renderBasedOnMediaType = () => {
        switch (fileAttachmentType) {
            case IMAGE:
                return (
                    <img
                        src={fileAttachmentUrl}
                        alt='media'
                        className='content--media img'
                        onClick={() => openPreviewModal(attachment)}
                    />
                );
            case FILE:
                return (
                    <div onClick={() => openPreviewModal(attachment)}>
                        <div className='content--document'>
                            <ReactSVG src={imageLinks?.svg?.document} />
                            <div className='details'>
                                <p>{truncate(fileAttachmentName)}</p>
                                <span>{getFileFormat(fileAttachmentName)}</span>
                            </div>
                        </div>
                        <iframe
                            src={`https://docs.google.com/gview?url=${fileAttachmentUrl}&embedded=true`}
                            width='100%'
                            height='100%'
                            frameborder='1'
                            title='file name'
                            sandbox='allow-modals'></iframe>
                    </div>
                );
            case VIDEO:
                return (
                    <video
                        className='content--media video'
                        controls
                        onClick={() => openPreviewModal(attachment)}>
                        <source src={fileAttachmentUrl} />
                    </video>
                );
                
            default:
                return ""
        }
    };

    return (
        <>
            {renderBasedOnMediaType()}
            {fileAttachmentCaption && fileAttachmentCaption !== "" && (
                <MessageContent
                    isReceivedMessage={true}
                    messageContent={fileAttachmentCaption}
                />
            )}
        </>
    );
};

export default MediaContent;

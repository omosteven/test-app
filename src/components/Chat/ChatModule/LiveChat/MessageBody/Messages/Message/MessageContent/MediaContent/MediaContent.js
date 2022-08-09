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

const MediaContent = ({ attachment, openPreviewModal }) => {
    const { fileAttachmentUrl, fileAttachmentType, fileAttachmentName } =
        attachment || {};

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
                            src={`https://docs.google.com/gview?url=https://test-account-service.s3.us-east-2.amazonaws.com/agentInbox/2613476289/d8baf951-31d7-41d8-b2b7-7c7912322c1e.pdf&embedded=true`}
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
        }
    };

    return <>{renderBasedOnMediaType()}</>;
};

export default MediaContent;

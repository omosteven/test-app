import {
    IMAGE,
    PDF,
    VIDEO,
} from "../../../../../LiveChatInput/UploadIcons/enum";
import "./MediaContent.scss";

const MediaContent = ({ attachment }) => {
    const { fileAttachmentUrl, fileAttachmentType } = attachment || {};

    const renderBasedOnMediaType = () => {
        switch (fileAttachmentType) {
            case IMAGE:
                return (
                    <img
                        src={fileAttachmentUrl}
                        alt='media'
                        className='media img'
                    />
                );
            case PDF:
                return <>{fileAttachmentUrl} </>;
            case VIDEO:
                return (
                    <video className='media' controls>
                        <source src={fileAttachmentUrl} />
                    </video>
                );
        }
    };

    return <>{renderBasedOnMediaType()}</>;
};

export default MediaContent;

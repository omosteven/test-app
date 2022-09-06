import UploadPreviewIcon from "../../UploadPreviewIcon/UploadPreviewIcon";
import imageLinks from "assets/images";
import { ReactSVG } from "react-svg";

const UploadPreviewVideo = ({
    fileAttachmentName,
    fileIndex,
    fileAttachmentUrl,
    fileAttachmentType,
    status,
    handleRemoveFile,
    disableClick,
    maximize,
}) => {
    return (
        <>
            <div>
                <UploadPreviewIcon
                    {...{
                        fileAttachmentName,
                        fileIndex,
                        status,
                        handleRemoveFile,
                    }}
                />

                <div
                    className={`upload__preview--media__container  ${
                        disableClick ? `disabled` : ``
                    }`}
                    onClick={() =>
                        maximize(
                            fileAttachmentType,
                            fileAttachmentName,
                            fileAttachmentUrl
                        )
                    }>
                    <video className='upload__preview--media'>
                        <source src={fileAttachmentUrl} />
                    </video>
                    <ReactSVG src={imageLinks?.svg?.play} className='play' />
                </div>
            </div>
        </>
    );
};

export default UploadPreviewVideo;

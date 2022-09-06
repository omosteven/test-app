import UploadPreviewIcon from "../../UploadPreviewIcon/UploadPreviewIcon";
import imageLinks from "assets/images";
import { ReactSVG } from "react-svg";

const UploadPreviewFile = ({
    fileAttachmentName,
    fileIndex,
    fileAttachmentUrl,
    fileAttachmentType,
    status,
    handleRemoveFile,
    disableClick,
    maximize,
    getFileFormat,
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
                    className={`upload__preview--document  ${
                        disableClick ? `disabled` : ``
                    }`}
                    onClick={() =>
                        maximize(
                            fileAttachmentType,
                            fileAttachmentName,
                            fileAttachmentUrl
                        )
                    }>
                    <ReactSVG src={imageLinks?.svg?.document} />
                    <div className='details'>
                        <p>{fileAttachmentName}</p>
                        <span>{getFileFormat(fileAttachmentName)}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UploadPreviewFile;

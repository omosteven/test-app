import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";
import UploadPreviewError from "../../UploadPreview/UploadPreviewError/UploadPreviewError";
import UploadedFileIcon from "./UploadedFileIcon/UploadedFileIcon";

const UploadedFile = ({
    handleRetry,
    file,
    status,
    handleRemoveFile,
    fileIndex,
}) => {
    const { fileAttachmentName, uploadStatus } = file;

    return (
        <>
            <div className='uploaded-file'>
                <div>
                    <ReactSVG src={imageLinks?.svg?.attachment} />
                    <span>{fileAttachmentName}</span>
                </div>

                <UploadedFileIcon
                    {...{
                        fileAttachmentName,
                        fileIndex,
                        handleRemoveFile,
                    }}
                    status={uploadStatus}
                />
                
                <UploadPreviewError
                    status={status || uploadStatus}
                    file={file}
                    handleRemoveFile={handleRemoveFile}
                    handleRetry={handleRetry}
                    fileIndex={fileIndex}
                    uploadStatus={uploadStatus}
                />
            </div>
        </>
    );
};

export default UploadedFile;

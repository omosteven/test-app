import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";
import { dataQueryStatus } from "utils/formatHandlers";
import "./UploadPreviewError.scss";

const { ERROR, DATAMODE } = dataQueryStatus;

const UploadPreviewError = ({
    status = ERROR,
    file,
    handleRemoveFile,
    handleRetry,
    fileIndex,
    uploadStatus = ERROR,
}) => {
    return (
        <>
            {(status === ERROR || status === DATAMODE) &&
                uploadStatus === ERROR && (
                    <div className='upload__preview--error__group'>
                        <ReactSVG
                            src={imageLinks?.svg?.retry}
                            onClick={() => handleRetry({ ...file, fileIndex })}
                        />{" "}
                        <ReactSVG
                            src={imageLinks?.svg?.abort}
                            onClick={() =>
                                handleRemoveFile(file?.fileAttachmentName)
                            }
                        />
                    </div>
                )}
        </>
    );
};

export default UploadPreviewError;

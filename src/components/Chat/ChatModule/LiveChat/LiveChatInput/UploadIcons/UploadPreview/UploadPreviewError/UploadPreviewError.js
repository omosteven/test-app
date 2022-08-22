import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";
import { dataQueryStatus } from "utils/formatHandlers";
import "./UploadPreviewError.scss";

const { ERROR } = dataQueryStatus;

const UploadPreviewError = ({
    status,
    file,
    handleRemoveFile,
    handleRetry,
}) => {
    return (
        <>
            {status === ERROR && (
                <div className='upload__preview--error__group'>
                    <ReactSVG
                        src={imageLinks?.svg?.retry}
                        onClick={() =>
                            handleRetry(
                                file?.fileAttachmentType,
                                file?.fileAttachmentUrl
                            )
                        }
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

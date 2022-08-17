import { ReactSVG } from "react-svg";
import imageLinks from "../../../../../../../assets/images";
import { IMAGE, FILE, VIDEO } from "../enum";
import { dataQueryStatus } from "../../../../../../../utils/formatHandlers";
import { getFileFormat } from "../../../../../../../utils/helper";
import "./UploadPreview.scss";
import { useState } from "react";

const { LOADING, ERROR, DATAMODE } = dataQueryStatus;

const UploadPreview = ({
    upload,
    status,
    handleRemoveFile,
    handleRetry,
    maximize,
    disableClick,
}) => {
    const [isCancellable, setIsCancellable] = useState(false);

    const renderBasedOnStatus = (fileAttachmentName) => {
        switch (status) {
            case LOADING:
                return (
                    <div
                        onMouseOver={() => setIsCancellable(true)}
                        onMouseOut={() => setIsCancellable(false)}>
                        {!isCancellable ? (
                            <ReactSVG
                                src={imageLinks?.svg?.loading}
                                className='upload__preview--icon loading'
                            />
                        ) : (
                            <ReactSVG
                                src={imageLinks?.svg?.remove}
                                className='upload__preview--icon'
                                onClick={() =>
                                    handleRemoveFile(fileAttachmentName)
                                }
                            />
                        )}
                    </div>
                );
            case DATAMODE:
                return (
                    <ReactSVG
                        src={imageLinks?.svg?.remove}
                        className='upload__preview--icon'
                        onClick={() => handleRemoveFile(fileAttachmentName)}
                    />
                );
            default:
                return "";
        }
    };

    const renderBasedOnUploadType = (
        fileAttachmentType,
        fileAttachmentName,
        fileAttachmentUrl
    ) => {
        console.log({
            fileAttachmentType,
            fileAttachmentName,
            fileAttachmentUrl,
        });
        switch (fileAttachmentType) {
            case IMAGE:
                return (
                    <>
                        {renderBasedOnStatus(fileAttachmentName)}
                        <img
                            src={fileAttachmentUrl}
                            alt='upload'
                            className={`upload__preview--media ${
                                disableClick ? `disabled` : ``
                            }`}
                            onClick={() =>
                                maximize(
                                    fileAttachmentType,
                                    fileAttachmentName,
                                    fileAttachmentUrl
                                )
                            }
                        />
                        {status === ERROR && (
                            <div className='upload__preview--error__group'>
                                <ReactSVG
                                    src={imageLinks?.svg?.retry}
                                    onClick={() =>
                                        handleRetry(
                                            fileAttachmentType,
                                            fileAttachmentUrl
                                        )
                                    }
                                />
                                <ReactSVG
                                    src={imageLinks?.svg?.abort}
                                    onClick={handleRemoveFile}
                                />
                            </div>
                        )}
                    </>
                );
            case FILE:
                return (
                    <>
                        {renderBasedOnStatus(fileAttachmentName)}
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
                        {status === ERROR && (
                            <div className='upload__preview--error__group'>
                                <ReactSVG
                                    src={imageLinks?.svg?.retry}
                                    onClick={() =>
                                        handleRetry(
                                            fileAttachmentType,
                                            fileAttachmentUrl
                                        )
                                    }
                                />
                                <ReactSVG
                                    src={imageLinks?.svg?.abort}
                                    onClick={handleRemoveFile}
                                />
                            </div>
                        )}
                    </>
                );
            case VIDEO:
                return (
                    <>
                        {renderBasedOnStatus(fileAttachmentName)}
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
                            <ReactSVG
                                src={imageLinks?.svg?.play}
                                className='play'
                            />
                        </div>
                        {status === ERROR && (
                            <div className='upload__preview--error__group'>
                                <ReactSVG
                                    src={imageLinks?.svg?.retry}
                                    onClick={() =>
                                        handleRetry(
                                            fileAttachmentType,
                                            fileAttachmentUrl
                                        )
                                    }
                                />
                                <ReactSVG
                                    src={imageLinks?.svg?.abort}
                                    onClick={handleRemoveFile}
                                />
                            </div>
                        )}
                    </>
                );
            default:
                return (
                    <>
                        {renderBasedOnStatus(fileAttachmentName)}
                        <img
                            src={fileAttachmentUrl}
                            alt='upload'
                            className={`upload__preview--media ${
                                disableClick ? `disabled` : ``
                            }`}
                            onClick={() =>
                                maximize(
                                    fileAttachmentType,
                                    fileAttachmentName,
                                    fileAttachmentUrl
                                )
                            }
                        />
                        {status === ERROR && (
                            <div className='upload__preview--error__group'>
                                <ReactSVG
                                    src={imageLinks?.svg?.retry}
                                    onClick={() =>
                                        handleRetry(
                                            fileAttachmentType,
                                            fileAttachmentUrl
                                        )
                                    }
                                />
                                <ReactSVG
                                    src={imageLinks?.svg?.abort}
                                    onClick={handleRemoveFile}
                                />
                            </div>
                        )}
                    </>
                );
        }
    };

    const handleUploadPreviewRender = () => {
        return upload?.map((file) => {
            return renderBasedOnUploadType(
                file?.fileAttachmentType,
                file?.fileAttachmentName,
                file?.fileAttachmentUrl
            );
        });
    };
    return (
        <>
            <div className='upload__preview'>{handleUploadPreviewRender()}</div>
        </>
    );
};

export default UploadPreview;

import { ReactSVG } from "react-svg";
import imageLinks from "../../../../../../../assets/images";
import { IMAGE, FILE, VIDEO } from "../enum";
import { dataQueryStatus } from "../../../../../../../utils/formatHandlers";
import { getFileFormat } from "../../../../../../../utils/helper";
import "./UploadPreview.scss";
import { useState } from "react";
import UploadPreviewError from "./UploadPreviewError/UploadPreviewError";

const { LOADING, DATAMODE } = dataQueryStatus;

const UploadPreview = ({
    upload,
    updateUpload,
    status,
    handleRemoveFile,
    handleRetry,
    maximize,
    disableClick,
}) => {
    // console?.log({ upload });
    // const [isCancellable, setIsCancellable] = useState(false);
    const updateCancellable = (fileAttachmentName, cancelStatus) => {
        // 
        updateUpload((prev) =>
            prev?.map((upload) =>
                upload?.fileAttachmentName === fileAttachmentName
                    ? { ...upload, isCancellable: cancelStatus }
                    : upload
            )
        );
    };
    const renderBasedOnStatus = (fileAttachmentName, isCancellable) => {
        switch (status) {
            case LOADING:
                return (
                    <div
                    // onMouseEnter={(e) => {
                    //     e.stopPropagation();
                    //     e.preventDefault();
                    //     updateCancellable(fileAttachmentName, true);
                    // }}
                    // onMouseLeave={(e) => {
                    //     e.stopPropagation();
                    //     e.preventDefault();
                    //     updateCancellable(fileAttachmentName, false);
                    // }}
                    >
                        {!isCancellable ? (
                            <ReactSVG
                                src={imageLinks?.svg?.loading}
                                className='upload__preview--icon loading'
                            />
                        ) : (
                            <ReactSVG
                                src={imageLinks?.svg?.remove}
                                className='upload__preview--icon'
                                // onClick={(e) => {
                                //     e.stopPropagation();
                                //     e.preventDefault();
                                //     handleRemoveFile(fileAttachmentName);
                                // }}
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
        fileAttachmentUrl,
        isCancellable
    ) => {
        switch (fileAttachmentType) {
            case IMAGE:
                return (
                    <div>
                        {renderBasedOnStatus(fileAttachmentName, isCancellable)}
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
                    </div>
                );
            case FILE:
                return (
                    <div>
                        {renderBasedOnStatus(fileAttachmentName, isCancellable)}
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
                );
            case VIDEO:
                return (
                    <div>
                        {renderBasedOnStatus(fileAttachmentName, isCancellable)}
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
                    </div>
                );
            default:
                return (
                    <div>
                        {renderBasedOnStatus(fileAttachmentName, isCancellable)}
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
                    </div>
                );
        }
    };

    const handleUploadPreviewRender = () => {
        return upload?.map((file, i) => {
            return (
                <div className='upload__preview--media__group' key={i}>
                    {renderBasedOnUploadType(
                        file?.fileAttachmentType,
                        file?.fileAttachmentName,
                        file?.fileAttachmentUrl,
                        file?.isCancellable
                    )}
                    <UploadPreviewError
                        status={status}
                        file={file}
                        handleRemoveFile={handleRemoveFile}
                        handleRetry={handleRetry}
                    />
                </div>
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

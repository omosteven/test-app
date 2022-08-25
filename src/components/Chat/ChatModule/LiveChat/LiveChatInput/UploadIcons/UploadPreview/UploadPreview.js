import { IMAGE, FILE, VIDEO } from "../enum";
import { getFileFormat } from "../../../../../../../utils/helper";
import "./UploadPreview.scss";

import UploadPreviewError from "./UploadPreviewError/UploadPreviewError";
import UploadPreviewVideo from "./UploadPreviewTypes/UploadPreviewVideo/UploadPreviewVideo";
import UploadPreviewFile from "./UploadPreviewTypes/UploadPreviewFile/UploadPreviewFile";
import UploadPreviewImage from "./UploadPreviewTypes/UploadPreviewImage/UploadPreviewImage";

const UploadPreview = ({
    upload,
    status,
    handleRemoveFile,
    handleRetry,
    maximize,
    disableClick,
}) => {
    const renderBasedOnUploadType = (
        fileAttachmentType,
        fileAttachmentName,
        fileAttachmentUrl,
        fileIndex,
        uploadStatus
    ) => {
        switch (fileAttachmentType) {
            case IMAGE:
                return (
                    <UploadPreviewImage
                        {...{
                            fileAttachmentName,
                            fileIndex,
                            fileAttachmentUrl,
                            fileAttachmentType,
                            status: uploadStatus || status,
                            handleRemoveFile,
                            disableClick,
                            maximize,
                        }}
                    />
                );
            case FILE:
                return (
                    <UploadPreviewFile
                        {...{
                            fileAttachmentName,
                            fileIndex,
                            fileAttachmentUrl,
                            fileAttachmentType,
                            status: uploadStatus || status,
                            handleRemoveFile,
                            getFileFormat,
                            maximize,
                            disableClick,
                        }}
                    />
                );
            case VIDEO:
                return (
                    <UploadPreviewVideo
                        {...{
                            fileAttachmentName,
                            fileIndex,
                            fileAttachmentUrl,
                            fileAttachmentType,
                            status: uploadStatus || status,
                            handleRemoveFile,
                            maximize,
                            disableClick,
                        }}
                    />
                );
            default:
                return (
                    <UploadPreviewImage
                        {...{
                            fileAttachmentName,
                            fileIndex,
                            fileAttachmentUrl,
                            fileAttachmentType,
                            status: uploadStatus || status,
                            handleRemoveFile,
                            disableClick,
                            maximize,
                        }}
                    />
                );
        }
    };

    const handleUploadPreviewRender = () => {
        return upload?.map((file, fileIndex) => {
            return (
                <div className='upload__preview--media__group' key={fileIndex}>
                    {renderBasedOnUploadType(
                        file?.fileAttachmentType,
                        file?.fileAttachmentName,
                        file?.fileAttachmentUrl,
                        fileIndex,
                        file?.uploadStatus
                    )}
                    <UploadPreviewError
                        status={status || file?.uploadStatus}
                        file={file}
                        handleRemoveFile={handleRemoveFile}
                        handleRetry={handleRetry}
                        fileIndex={fileIndex}
                        uploadStatus={file?.uploadStatus}
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

import UploadPreviewIcon from "../../UploadPreviewIcon/UploadPreviewIcon";

const UploadPreviewImage = ({
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
        </>
    );
};

export default UploadPreviewImage;

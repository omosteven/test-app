import imageLinks from "../../../../../../assets/images";
import AttachmentInput from "../../../../../ui/InputTypes/Attachment/Attachment";
import { IMAGE, FILE, VIDEO } from "./enum";
import ModalPreview from "../../ModalPreview/ModalPreview";
import "./UploadIcons.scss";

const UploadIcons = ({
    upload,
    updateUpload,
    handleRemoveFile,
    isDisabled,
    setErrors,
    sendNewMessage,
    uploadType,
    setUploadType,
    showModal,
    toggleModal,
    handleUpload,
    file
}) => {
    const getFileFormat = (fileType) => {
        if (fileType?.startsWith("image/")) {
            return IMAGE;
        } else if (fileType?.startsWith("application/")) {
            return FILE;
        } else if (fileType?.startsWith("video/")) {
            return VIDEO;
        }
    };

    const uploadFile = ({ target: { files } }) => {
        const file = files[0];
        if (file) {
            setErrors((prev) => ({ ...prev, file: "" }));
            const uploadType = getFileFormat(file?.type);

            if (
                uploadType === IMAGE
                    ? file.size > 5242880
                    : file.size > 20971520
            ) {
                const message =
                    uploadType === IMAGE
                        ? "Image should not be more than 5MB"
                        : "File should not be more than 20MB";

                return setErrors((prev) => ({ ...prev, file: message }));
            }

            const uploadPreview = URL.createObjectURL(file);

            updateUpload((prev) => ({
                ...prev,
                preview: uploadPreview,
                file,
            }));
            setUploadType(uploadType);
            handleUpload(file, uploadType);
        }
    };

    return (
        <div className='upload'>
            <div className='upload--icons'>
                <AttachmentInput
                    id='file'
                    src={imageLinks?.svg?.attachment}
                    accept='.pdf,.doc,.docx,video/*'
                    onChange={uploadFile}
                    disabled={isDisabled}
                    file={file}
                />
                <AttachmentInput
                    id='image'
                    src={imageLinks?.svg?.upload_image}
                    accept='image/png,image/jpeg,image/jpg'
                    onChange={uploadFile}
                    disabled={isDisabled}
                    file={file}
                />
            </div>
            {showModal && (
                <ModalPreview
                    showModal={showModal}
                    toggleModal={() => toggleModal(false)}
                    preview={upload?.preview}
                    previewType={uploadType}
                    fileName={upload?.file?.name}
                    sendNewMessage={() => {
                        toggleModal(false);
                        sendNewMessage();
                    }}
                    handleRemoveFile={() => {
                        toggleModal(false);
                        handleRemoveFile();
                    }}
                />
            )}
        </div>
    );
};

export default UploadIcons;

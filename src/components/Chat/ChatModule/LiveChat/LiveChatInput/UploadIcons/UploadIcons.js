import imageLinks from "../../../../../../assets/images";
import AttachmentInput from "../../../../../ui/InputTypes/Attachment/Attachment";
import { IMAGE, FILE, VIDEO } from "./enum";
import ModalPreview from "../../ModalPreview/ModalPreview";
import "./UploadIcons.scss";

const UploadIcons = ({
    updateUpload,
    handleRemoveFile,
    isDisabled,
    setErrors,
    sendNewMessage,
    showModal,
    toggleModal,
    handleUpload,
    file,
    selectedMedia,
    currentFormElement,
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

    const uploadFile = (files) => {
        const selectedFiles = currentFormElement ? files[0] : files;

        const uploaded = [];
        selectedFiles?.map((file) => {
            console.log({ file });
            const uploadType = getFileFormat(file?.type);
            const url = URL.createObjectURL(file);

            const uploadObj = {
                file,
                fileAttachmentUrl: url,
                fileAttachmentType: uploadType,
                fileAttachmentName: file?.name,
            };

            updateUpload((prev) => [...prev, uploadObj]);
            uploaded.push(uploadObj);
        });
        // setErrors((prev) => ({ ...prev, file: "" }));

        // if (
        //     uploadType === IMAGE
        //         ? file.size > 5242880
        //         : file.size > 20971520
        // ) {
        //     const message =
        //         uploadType === IMAGE
        //             ? "Image should not be more than 5MB"
        //             : "File should not be more than 20MB";

        //     return setErrors((prev) => ({ ...prev, file: message }));
        // }

        handleUpload(uploaded);
    };

    const handleFileEvent = ({ target: { files } }) => {
        const file = currentFormElement ? files[0] : files;
        if (file) {
            const selectedFiles = Array.prototype.slice.call(file);
            uploadFile(selectedFiles);
        }
    };

    return (
        <div className='upload'>
            <div className='upload--icons'>
                <AttachmentInput
                    id='file'
                    src={imageLinks?.svg?.attachment}
                    accept='.pdf,.doc,.docx,video/*,image/png,image/jpeg,image/jpg'
                    onChange={handleFileEvent}
                    disabled={isDisabled}
                    file={file}
                    multiple={currentFormElement === undefined}
                />
            </div>
            {showModal && (
                <ModalPreview
                    showModal={showModal}
                    toggleModal={() => toggleModal(false)}
                    preview={selectedMedia?.fileAttachmentUrl}
                    previewType={selectedMedia?.fileAttachmentType}
                    fileName={selectedMedia?.fileAttachmentName}
                    sendNewMessage={() => {
                        toggleModal(false);
                        sendNewMessage();
                    }}
                    handleRemoveFile={(fileName) => {
                        handleRemoveFile(fileName);
                        toggleModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default UploadIcons;

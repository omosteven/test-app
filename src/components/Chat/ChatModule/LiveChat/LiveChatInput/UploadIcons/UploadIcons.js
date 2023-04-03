import imageLinks from "../../../../../../assets/images";
import AttachmentInput from "../../../../../ui/InputTypes/Attachment/Attachment";
import { IMAGE, FILE, VIDEO } from "./enum";
import ModalPreview from "../../ModalPreview/ModalPreview";
import "./UploadIcons.scss";

const UploadIcons = ({
    upload,
    updateUpload,
    isDisabled,
    setErrors,
    showModal,
    toggleModal,
    handleUpload,
    selectedMedia,
    currentFormElement,
    label,
    icon,
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
        if (upload?.length > 5 || upload?.length + files?.length > 5) {
            return setErrors((prev) => ({
                ...prev,
                file: "Maximum of 5 files",
            }));
        }
        const selectedFiles = currentFormElement ? [files[0]] : files;
        setErrors((prev) => ({ ...prev, file: "" }));

        const uploaded = [];
        selectedFiles?.map((file) => {
            const uploadType = getFileFormat(file?.type);

            if (
                uploadType === IMAGE
                    ? file.size > 5242880
                    : file.size > 20971520
            ) {
                const message =
                    "Large files have been excluded. (Image, 5MB) (File, 20MB)";

                return setErrors((prev) => ({ ...prev, file: message }));
            }

            const url = URL.createObjectURL(file);

            const uploadObj = {
                file,
                fileAttachmentUrl: url,
                fileAttachmentType: uploadType,
                fileAttachmentName: file?.name,
            };

            updateUpload((prev) => [...prev, uploadObj]);
            return uploaded.push(uploadObj);
        });

        handleUpload(uploaded);
    };

    const handleFileEvent = ({ target: { files } }) => {
        if (files) {
            const selectedFiles = Array.prototype.slice.call(files);
            // maximum of five files
            const firstFiveFiles = selectedFiles?.slice(0, 5);
            uploadFile(firstFiveFiles);
        }
    };

    return (
        <div className='upload'>
            <div className='upload--icons'>
                <AttachmentInput
                    id='file'
                    src={icon ? icon : imageLinks?.svg?.attachment}
                    accept='.pdf,.doc,.docx,image/png,image/jpeg,image/jpg'
                    onChange={handleFileEvent}
                    disabled={isDisabled}
                    file={upload}
                    multiple={currentFormElement === undefined}
                    label={label}
                />
            </div>
            {showModal && (
                <ModalPreview
                    showModal={showModal}
                    toggleModal={() => toggleModal(false)}
                    preview={selectedMedia?.fileAttachmentUrl}
                    previewType={selectedMedia?.fileAttachmentType}
                    fileName={selectedMedia?.fileAttachmentName}
                />
            )}
        </div>
    );
};

export default UploadIcons;

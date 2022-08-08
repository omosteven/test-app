import { useState } from "react";
import imageLinks from "../../../../../../assets/images";
import API from "../../../../../../lib/api";
import apiRoutes from "../../../../../../lib/api/apiRoutes";
import AttachmentInput from "../../../../../ui/InputTypes/Attachment/Attachment";
import { IMAGE, FILE, VIDEO } from "./enum";
import UploadPreview from "./UploadPreview/UploadPreview";
import { dataQueryStatus } from "../../../../../../utils/formatHandlers";
import ModalPreview from "../../ModalPreview/ModalPreview";
import "./UploadIcons.scss";
import { getErrorMessage } from "../../../../../../utils/helper";

const { LOADING, ERROR, DATAMODE } = dataQueryStatus;

const UploadIcons = ({
    updateRequest,
    upload,
    updateUpload,
    isDisabled,
    setErrors,
    sendNewMessage,
    setErrorMssg,
}) => {
    const [uploadType, setUploadType] = useState("");
    const [status, setStatus] = useState("");
    const [showModal, toggleModal] = useState(false);

    const getFileFormat = (fileType) => {
        if (fileType?.startsWith("image/")) {
            return IMAGE;
        } else if (fileType?.startsWith("application/")) {
            return FILE;
        } else if (fileType?.startsWith("video/")) {
            return VIDEO;
        }
    };

    const handleRemoveFile = () => {
        updateUpload({
            preview: "",
            file: "",
            isLoading: false,
        });
        updateRequest((prev) => ({
            ...prev,
            fileAttachment: {
                fileAttachmentUrl: "",
                fileAttachmentType: "",
            },
        }));
    };

    const handleUpload = async (file, uploadType) => {
        try {
            setStatus(LOADING);
            updateUpload((prev) => ({ ...prev, isLoading: true }));

            const url = apiRoutes.fileUpload;
            const formData = new FormData();

            formData.append("file", file);
            const res = await API.post(url, formData);

            if (res.status === 201) {
                const { data } = res.data;
                setStatus(DATAMODE);

                updateUpload((prev) => ({ ...prev, isLoading: false }));
                updateRequest((prev) => ({
                    ...prev,
                    fileAttachment: {
                        fileAttachmentUrl: data,
                        fileAttachmentType: uploadType,
                    },
                }));
            }
        } catch (err) {
            setStatus(ERROR);
            updateUpload((prev) => ({ ...prev, isLoading: false }));
            const message = getErrorMessage(err);
            setErrorMssg(message);
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

            setUploadType(uploadType);

            const uploadPreview = URL.createObjectURL(file);

            updateUpload((prev) => ({ ...prev, preview: uploadPreview, file }));
            handleUpload(file, uploadType);
        }
    };

    return (
        <div className='upload'>
            {upload?.preview && (
                <UploadPreview
                    uploadPreview={
                        uploadType === FILE
                            ? upload?.file?.name
                            : upload?.preview
                    }
                    status={status}
                    uploadType={uploadType}
                    handleRemoveFile={handleRemoveFile}
                    handleRetry={() => handleUpload(upload?.file, uploadType)}
                    onClick={() => toggleModal(true)}
                />
            )}
            <div className='upload--icons'>
                <AttachmentInput
                    id='file'
                    src={imageLinks?.svg?.attachment}
                    accept='.pdf,.doc,.docx,video/*'
                    onChange={uploadFile}
                    disabled={isDisabled}
                />
                <AttachmentInput
                    id='image'
                    src={imageLinks?.svg?.upload_image}
                    accept='image/png,image/jpeg,image/jpg'
                    onChange={uploadFile}
                    disabled={isDisabled}
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

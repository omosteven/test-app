import { useState } from "react";
import imageLinks from "../../../../../../assets/images";
import API from "../../../../../../lib/api";
import apiRoutes from "../../../../../../lib/api/apiRoutes";
import AttachmentInput from "../../../../../ui/InputTypes/Attachment/Attachment";
import { IMAGE, PDF, VIDEO } from "./enum";
import UploadPreview from "./UploadPreview/UploadPreview";
import { dataQueryStatus } from "../../../../../../utils/formatHandlers";
import "./UploadIcons.scss";

const { LOADING, ERROR, DATAMODE } = dataQueryStatus;

const UploadIcons = ({
    updateRequest,
    upload,
    updateUpload,
    isDisabled,
    setErrors,
}) => {
    const [uploadType, setUploadType] = useState("");
    const [status, setStatus] = useState("");

    const getFileType = (fileType) => {
        if (fileType?.startsWith("image/")) {
            return IMAGE;
        } else if (fileType?.startsWith("application/pdf")) {
            return PDF;
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
        }
    };

    const uploadFile = ({ target: { files } }) => {
        const file = files[0];
        if (file) {
            setErrors((prev) => ({ ...prev, file: "" }));
            const uploadType = getFileType(file?.type);

            if (
                uploadType === IMAGE
                    ? file.size > 5242880
                    : file.size > 20971520
            ) {
                const message =
                    uploadType === IMAGE
                        ? "Image should not be more than 2MB"
                        : "File should not be more than 5MB";

                return setErrors((prev) => ({ ...prev, file: message }));
            }

            setUploadType(uploadType);

            const uploadPreview =
                uploadType === PDF ? file?.name : URL.createObjectURL(file);

            updateUpload((prev) => ({ ...prev, preview: uploadPreview, file }));

            handleUpload(file, uploadType);
        }
    };

    return (
        <div className='upload'>
            <div className='upload--icons'>
                <AttachmentInput
                    id='file'
                    src={imageLinks?.svg?.attachment}
                    accept='.pdf,video/*'
                    onChange={uploadFile}
                    disabled={isDisabled}
                />
                <AttachmentInput
                    id='image'
                    src={imageLinks?.svg?.upload_image}
                    accept='image/*'
                    onChange={uploadFile}
                    disabled={isDisabled}
                />
            </div>
            {upload?.preview && (
                <UploadPreview
                    uploadPreview={upload?.preview}
                    status={status}
                    uploadType={uploadType}
                    handleRemoveFile={handleRemoveFile}
                    handleRetry={() => handleUpload(upload?.file, uploadType)}
                />
            )}
        </div>
    );
};

export default UploadIcons;

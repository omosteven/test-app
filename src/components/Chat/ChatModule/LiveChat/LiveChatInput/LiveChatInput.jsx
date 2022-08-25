import { useState, useEffect, useContext } from "react";
import { ReactSVG } from "react-svg";
import imageLinks from "../../../../../assets/images";
import { SocketContext } from "../../../../../lib/socket/context/socket";
import { IS_NOT_TYPING, IS_TYPING } from "../../../../../lib/socket/events";
import { Button, Input } from "../../../../ui";
import SelectUI from "../../../../ui/InputTypes/SelectUI/SelectUI";
import { formInputTypes } from "../MessageBody/Messages/Message/enums";
import { useIsTyping } from "use-is-typing";
import PoweredBy from "../../../../common/PoweredBy/PoweredBy";
import CustomDatePicker from "../../../../ui/InputTypes/DatePicker/DatePicker";
import UploadIcons from "./UploadIcons/UploadIcons";
import UploadPreview from "./UploadIcons/UploadPreview/UploadPreview";

import API from "../../../../../lib/api";
import apiRoutes from "../../../../../lib/api/apiRoutes";
import { dataQueryStatus } from "../../../../../utils/formatHandlers";
import { getErrorMessage } from "../../../../../utils/helper";
import "./LiveChatInput.scss";

const { LOADING, ERROR, DATAMODE } = dataQueryStatus;
const { TEXT, NUMERIC, LONG_TEXT, DATE, MULTISELECT } = formInputTypes;

const LiveChatInput = ({
    handleNewMessage,
    ticketId,
    fetchingInputStatus,
    allowUserInput,
    inputType,
    currentFormElement,
}) => {
    const [isTyping, inputRef] = useIsTyping();

    const [request, updateRequest] = useState({
        message: "",
        fileAttachments: [
            {
                fileAttachmentUrl: "",
                fileAttachmentType: "",
                fileAttachmentName: "",
            },
        ],
    });
    const [uploads, updateUploads] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState({});
    const [errors, setErrors] = useState({});
    const [errorMssg, setErrorMssg] = useState("");
    const [status, setStatus] = useState();
    const [showModal, toggleModal] = useState(false);
    const isDisabled = fetchingInputStatus || !allowUserInput;

    const socket = useContext(SocketContext);

    const handleRemoveFile = (fileName, fileIndex) => {
        updateUploads((prev) =>
            prev?.filter((upload) => upload?.fileAttachmentName !== fileName)
        );

        updateRequest((prev) => ({
            ...prev,
            fileAttachments: prev?.fileAttachments?.filter(
                (upload) => upload?.fileAttachmentName !== fileName
            ),
        }));

        setErrors((prev) => ({ ...prev, file: "" }));
    };

    const handleRetryUpload = async (file) => {
        try {
            setErrorMssg();

            let prevUploads = [...uploads];
            prevUploads[file?.fileIndex] = {
                ...file,
                uploadStatus: LOADING,
            };

            updateUploads(prevUploads);

            const url = apiRoutes.fileUpload;
            const formData = new FormData();

            let httpRequest = new AbortController();

            formData.append("file", file?.file);

            let resolvedUpload = await API.post(url, formData, {
                signal: httpRequest?.signal,
            });

            let newUpload = {
                ...file,
                fileAttachmentUrl: resolvedUpload.data.data,
                uploadStatus: DATAMODE,
            };

            let newUploads = [...uploads];

            newUploads[file?.fileIndex] = {
                ...newUpload,
                uploadStatus: DATAMODE,
            };

            updateUploads(newUploads);

            updateRequest((prev) => ({
                ...prev,
                fileAttachments: newUploads?.filter(
                    (upload) => upload?.uploadStatus === DATAMODE
                ),
            }));
        } catch (errorMsg) {
            let prevUploads = [...uploads];
            prevUploads[file?.fileIndex] = {
                ...file,
                uploadStatus: ERROR,
            };

            updateUploads(prevUploads);

            setStatus(ERROR);
            const message = getErrorMessage(errorMsg);
            setErrorMssg(message);
        }
    };

    const handleUpload = async (files) => {
        setStatus(LOADING);
        setErrorMssg("");

        const uploadedFiles = files?.map(async (media, key) => {
            const url = apiRoutes.fileUpload;
            const formData = new FormData();

            formData.append("file", media?.file);
            const res = await API.post(url, formData);

            if (res.status === 201) {
                const { data } = res.data;

                const { file, ...rest } = media;

                return { ...rest, fileAttachmentUrl: data, isError: false };
            }
        });

        const resolvedUploads = await Promise.allSettled(uploadedFiles);

        let totalRequests = uploadedFiles.length;
        let totalFailedRequests = 0;
        let errorMsg = "";

        let resolvedUpload = resolvedUploads.map(
            (eachUploadResp, fileIndex) => {
                let { status, reason, value } = eachUploadResp;
                errorMsg = reason;
                if (status === "fulfilled") {
                    value = { ...value, fileIndex, uploadStatus: DATAMODE };
                } else {
                    totalFailedRequests += 1;
                    value = {
                        ...files[fileIndex],
                        fileIndex,
                        uploadStatus: ERROR,
                    };
                }
                return value;
            }
        );

        if (totalFailedRequests === totalRequests) {
            setStatus(ERROR);
            const message = getErrorMessage(errorMsg);
            setErrorMssg(message);
        } else {
            updateUploads(resolvedUpload);
            updateRequest((prev) => ({
                ...prev,
                fileAttachments: resolvedUpload?.filter(
                    (upload) => upload?.uploadStatus === DATAMODE
                ),
            }));
            setStatus(DATAMODE);
        }
    };

    const sendNewMessage = () => {
        handleNewMessage(request);
        updateRequest({
            message: "",
            fileAttachments: [
                {
                    fileAttachmentUrl: "",
                    fileAttachmentType: "",
                    fileAttachmentName: "",
                },
            ],
        });
        updateUploads([]);
        setErrors((prev) => ({ ...prev, file: "" }));
    };

    // const handleInputFocus = () => {
    //     document.getElementById('inputGroup').scrollIntoView({ behavior: 'smooth', block: 'end' });
    // }

    const handleTyping = (e) => {
        let { value } = e.target;
        if (inputType === NUMERIC) {
            console.log(value.replace(/\D/g, ""));
            value = value.replace(/\D/g, "");
        }
        updateRequest({ ...request, message: value });
    };

    useEffect(() => {
        const decidedEvent = isTyping ? IS_TYPING : IS_NOT_TYPING;
        socket.emit(decidedEvent, { ticketId });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTyping]);

    useEffect(() => {
        return () => {
            socket.emit(IS_NOT_TYPING, { ticketId });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderBasedOnInputType = () => {
        const { formElementPlaceholder, formElementOptions, options } =
            currentFormElement || {};
        switch (inputType) {
            case TEXT:
            case NUMERIC:
            case LONG_TEXT:
                return (
                    <Input
                        placeholder={
                            formElementPlaceholder
                                ? formElementPlaceholder
                                : "Type message here"
                        }
                        inputClass='w-100 border-0'
                        value={request?.message}
                        onChange={handleTyping}
                        grpClass='w-100'
                        label='Chat'
                        // onFocus={handleInputFocus}
                        hideLabel={true}
                        ref={inputRef}
                        disabled={isDisabled}
                    />
                );
            // case :
            //     <Textarea
            //         placeholder={formElementPlaceholder ? formElementPlaceholder : "Type message here"}
            //         inputClass="w-100 border-0"
            //         value={message}
            //         onChange={handleTyping}
            //         grpClass="w-100"
            //         label="Chat"
            //         hideLabel={true}
            //         ref={inputRef}
            //         isLoading={fetchingConvos}
            //         disabled={isDisabled}
            //     />

            case DATE:
                return (
                    <CustomDatePicker
                        onChange={(date) =>
                            updateRequest({ ...request, message: date })
                        }
                    />
                );

            case MULTISELECT:
                const usedArr = options ? options : formElementOptions;
                const selectOptions = usedArr?.map((item) => ({
                    label: item,
                    value: item,
                }));
                return (
                    <SelectUI
                        options={selectOptions}
                        handleChange={(value) =>
                            updateRequest({ ...request, message: value })
                        }
                    />
                );

            default:
                return (
                    <Input
                        placeholder='Type message here'
                        inputClass='w-100 border-0'
                        value={request?.message}
                        onChange={handleTyping}
                        grpClass='w-100'
                        label='Chat'
                        ref={inputRef}
                        hideLabel={true}
                        disabled={isDisabled}
                    />
                );
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendNewMessage();
    };

    const btnDisabled =
        uploads?.length > 0
            ? status === LOADING || status === ""
            : isDisabled || request?.message === "";

    return (
        <div id='inputGroup' className='col-md-10 col-12'>
            {/* {showConvos && <SuggestedConvos data={suggestedList} handleConvoClick={handleConvoClick} />} */}
            <form onSubmit={handleSubmit} id='chatInput'>
                <div className='chat__input--container'>
                    {uploads?.length > 0 && (
                        <UploadPreview
                            upload={uploads}
                            status={status}
                            handleRemoveFile={handleRemoveFile}
                            handleRetry={(file) => handleRetryUpload(file)}
                            maximize={(
                                fileAttachmentType,
                                fileAttachmentName,
                                fileAttachmentUrl
                            ) => {
                                setSelectedMedia({
                                    fileAttachmentType,
                                    fileAttachmentName,
                                    fileAttachmentUrl,
                                });
                                toggleModal(true);
                            }}
                            disableClick={status !== DATAMODE}
                        />
                    )}
                    <div className='chat__input--group'>
                        <UploadIcons
                            upload={uploads}
                            updateUpload={updateUploads}
                            isDisabled={isDisabled}
                            setErrors={setErrors}
                            showModal={showModal}
                            toggleModal={toggleModal}
                            handleUpload={handleUpload}
                            selectedMedia={selectedMedia}
                            currentFormElement={currentFormElement}
                        />
                        {renderBasedOnInputType()}
                        <div>
                            <Button
                                type='submit'
                                text={"Send"}
                                icon={<ReactSVG src={imageLinks?.svg?.send} />}
                                classType='default'
                                otherClass={`send__button ${
                                    !btnDisabled ? "active" : ""
                                }`}
                                disabled={btnDisabled || fetchingInputStatus}
                            />
                        </div>
                    </div>
                </div>
                {(errors?.file || errorMssg) && (
                    <span className='file__error'>
                        {errors?.file || errorMssg}
                    </span>
                )}
            </form>
            <PoweredBy />
        </div>
    );
};

export default LiveChatInput;

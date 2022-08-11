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
import { FILE } from "./UploadIcons/enum";
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
        fileAttachment: {
            fileAttachmentUrl: "",
            fileAttachmentType: "",
            fileAttachmentName: "",
        },
    });
    const [upload, updateUpload] = useState({
        preview: "",
        file: {},
        isLoading: false,
    });
    const [errors, setErrors] = useState({});
    const [errorMssg, setErrorMssg] = useState("");
    const [status, setStatus] = useState("");
    const [uploadType, setUploadType] = useState("");
    const [showModal, toggleModal] = useState(false);
    const isDisabled = fetchingInputStatus || !allowUserInput;
    const [cancelRequest, setCancelRequest] = useState();

    const socket = useContext(SocketContext);

    const handleRemoveFile = () => {
        cancelRequest?.abort();
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
                fileAttachmentName: "",
            },
        }));
    };

    const handleUpload = async (file, uploadType) => {
        try {
            setStatus(LOADING);
            setErrorMssg("");
            let httpRequest = new AbortController();

            setCancelRequest(httpRequest);

            updateUpload((prev) => ({ ...prev, isLoading: true }));

            const url = apiRoutes.fileUpload;
            const formData = new FormData();

            // formData.append("file", file);
            // const res = await API.post(url, formData, {
            //     signal: httpRequest?.signal,
            // });

            // if (res.status === 201) {
            //     const { data } = res.data;
            //     setStatus(DATAMODE);

            //     updateUpload((prev) => ({
            //         ...prev,
            //         preview: data,
            //         isLoading: false,
            //     }));
            //     updateRequest((prev) => ({
            //         ...prev,
            //         fileAttachment: {
            //             fileAttachmentUrl: data,
            //             fileAttachmentType: uploadType,
            //             fileAttachmentName: file?.name,
            //         },
            //     }));
            // }
        } catch (err) {
            const newStatus = err?.message ? "" : ERROR;
            setStatus(newStatus);
            updateUpload((prev) => ({ ...prev, isLoading: false }));
            const message = getErrorMessage(err);
            setErrorMssg(err?.message ? "" : message);
            setCancelRequest();
        }
    };

    const sendNewMessage = () => {
        handleNewMessage(request);
        updateRequest({
            message: "",
            fileAttachment: {
                fileAttachmentUrl: "",
                fileAttachmentType: "",
                fileAttachmentName: "",
            },
        });
        updateUpload({
            preview: "",
            file: {},
            isLoading: false,
        });
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
        upload?.preview?.length > 0
            ? upload?.isLoading
            : isDisabled || request?.message === "";

    return (
        <div id='inputGroup' className='col-md-10 col-12'>
            {/* {showConvos && <SuggestedConvos data={suggestedList} handleConvoClick={handleConvoClick} />} */}
            <form onSubmit={handleSubmit} id='chatInput'>
                <div className='chat__input--container'>
                    {upload?.file?.name && (
                        <UploadPreview
                            uploadPreview={
                                uploadType === FILE
                                    ? upload?.file?.name
                                    : upload?.preview
                            }
                            status={status}
                            uploadType={uploadType}
                            handleRemoveFile={handleRemoveFile}
                            handleRetry={() =>
                                handleUpload(upload?.file, uploadType)
                            }
                            onClick={() => toggleModal(true)}
                            disableClick={status !== DATAMODE}
                        />
                    )}
                    <div className='chat__input--group'>
                        <UploadIcons
                            upload={upload}
                            updateUpload={updateUpload}
                            isDisabled={isDisabled}
                            setErrors={setErrors}
                            sendNewMessage={sendNewMessage}
                            uploadType={uploadType}
                            setUploadType={setUploadType}
                            showModal={showModal}
                            toggleModal={toggleModal}
                            handleUpload={handleUpload}
                            file={upload?.file}
                        />
                        {renderBasedOnInputType()}
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

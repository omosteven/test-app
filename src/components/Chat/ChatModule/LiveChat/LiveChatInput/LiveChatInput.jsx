import { useState, useEffect, useContext } from "react";
import { ReactSVG } from "react-svg";
import imageLinks from "../../../../../assets/images";
import { SocketContext } from "../../../../../lib/socket/context/socket";
import { IS_NOT_TYPING, IS_TYPING } from "../../../../../lib/socket/events";
import { Button, Input } from "../../../../ui";
import SelectUI from "../../../../ui/InputTypes/SelectUI/SelectUI";
import { useIsTyping } from "use-is-typing";
import PoweredBy from "../../../../common/PoweredBy/PoweredBy";
import CustomDatePicker from "../../../../ui/InputTypes/DatePicker/DatePicker";
import UploadIcons from "./UploadIcons/UploadIcons";
import UploadPreview from "./UploadIcons/UploadPreview/UploadPreview";
import API from "../../../../../lib/api";
import apiRoutes from "../../../../../lib/api/apiRoutes";
import { dataQueryStatus } from "../../../../../utils/formatHandlers";
import { getErrorMessage } from "../../../../../utils/helper";
import { formInputTypes } from "../MessageBody/Messages/enums";
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
    const [upload, updateUpload] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState({});
    const [errors, setErrors] = useState({});
    const [errorMssg, setErrorMssg] = useState("");
    const [status, setStatus] = useState();
    const [showModal, toggleModal] = useState(false);
    const isDisabled = fetchingInputStatus || !allowUserInput;
    const [cancelRequest, setCancelRequest] = useState();

    const socket = useContext(SocketContext);

    const handleRemoveFile = (fileName) => {
        // cancelRequest?.abort();
        updateUpload((prev) =>
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

    const handleUpload = async (files) => {
        try {
            setStatus(LOADING);
            setErrorMssg("");
            let httpRequest = new AbortController();

            setCancelRequest(httpRequest);

            const uploadedFiles = files?.map(async (media) => {
                const url = apiRoutes.fileUpload;
                const formData = new FormData();

                formData.append("file", media?.file);
                const res = await API.post(url, formData, {
                    signal: httpRequest?.signal,
                });

                if (res.status === 201) {
                    const { data } = res.data;

                    const { file, isCancellable, ...rest } = media;

                    return { ...rest, fileAttachmentUrl: data };
                }
            });
            const resolvedUpload = await Promise.all(uploadedFiles);

            updateUpload(resolvedUpload);
            updateRequest((prev) => ({
                ...prev,
                fileAttachments: resolvedUpload,
            }));
            setStatus(DATAMODE);
        } catch (err) {
            setStatus(ERROR);
            const message = getErrorMessage(err);
            setErrorMssg(message);
            // setCancelRequest();
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
        updateUpload([]);
        setErrors((prev) => ({ ...prev, file: "" }));
    };

    // const handleInputFocus = () => {
    //     document.getElementById('inputGroup').scrollIntoView({ behavior: 'smooth', block: 'end' });
    // }

    const handleTyping = (e) => {
        let { value } = e.target;
        if (inputType === NUMERIC) {
            
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
        upload?.length > 0
            ? status === LOADING || status === ""
            : isDisabled || request?.message === "";

    return (
        <div 
            id='inputGroup' 
            className={`col-md-10 col-12 ${!allowUserInput ? 'disallowed__section' : ''}`}
            title={!allowUserInput ? 'Not Allowed' : 'Type a message'}>
            <form onSubmit={handleSubmit} id='chatInput'>
                <div className='chat__input--container'>
                    {upload?.length > 0 && (
                        <UploadPreview
                            upload={upload}
                            updateUpload={updateUpload}
                            status={status}
                            handleRemoveFile={handleRemoveFile}
                            handleRetry={(
                                fileAttachmentType,
                                fileAttachmentUrl
                            ) =>
                                handleUpload([
                                    { fileAttachmentType, fileAttachmentUrl },
                                ])
                            }
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
                            upload={upload}
                            updateUpload={updateUpload}
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

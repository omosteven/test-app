import { useState, useEffect, useContext, useRef } from "react";
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
    const inputContainerRef = useRef();


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
    const showIphoneKeyboard = () => {
        // Moves the real input on-screen
        const chatInterface = document.getElementById('chatInterface')
        const ticketsHeader = document.getElementById('ticketsHeader')

        inputContainerRef.current.style.position = "absolute";
        inputContainerRef.current.style.zIndex = 999;
        inputContainerRef.current.style.left = "0px";
        inputContainerRef.current.style.bottom = "0px";

        // inputContainerRef.current.style.width = "100%";
        // inputContainerRef.current.style.height = "64px";
        inputContainerRef.current.addEventListener("wheel", e => {
            e.preventDefault();
        });
        chatInterface.addEventListener("wheel", e => {
            e.preventDefault();
        });
        ticketsHeader.addEventListener("wheel", e => {
            e.preventDefault();
        });


        // const height = window.visualViewport.height;
        // const viewport = window.visualViewport;

        return "";
        // Positions the real input at the right height for the type of iPhone
        switch (window.innerHeight) {
            case 896:
            case 798: // iPhone XR, Xs Max iOS 12.4
                inputContainerRef.current.style.bottom = "288px";
                // messageListContainerRef.current.style.height = "312px";
                break;
            case 714: // iPhone X, Xs
                inputContainerRef.current.style.top = "304px";
                // messageListContainerRef.current.style.height = "300px";
                break;
            case 696: // iPhone 6 Plus, 6s Plus, 7 Plus, 8 Plus
                inputContainerRef.current.style.top = "316px";
                // messageListContainerRef.current.style.height = "300px";
                break;
            case 627: // iPhone 6, 6s, 7, 8
                inputContainerRef.current.style.top = "258px";
                // messageListContainerRef.current.style.height = "300px";
                break;
            case 528: // iPhone 5s, SE, iOS 12.4
                inputContainerRef.current.style.top = "166px";
                // messageListContainerRef.current.style.height = "300px";
                break;
            default:
                inputContainerRef.current.style.top = "356px";
            // messageListContainerRef.current.style.height = "300px";
        }


    };

    const handleInputFocus = () => {
        console.log("shoullll")
        const iOS = !window.MSStream && /iPad|iPhone|iPod/.test(navigator.userAgent); // fails on iPad iOS 13
        if (iOS) {
            document.body.classList.add("keyboard")
            console.log("on an iphone")
            showIphoneKeyboard()
        }
    }

    const handleInputBlur = () => {
        const chatInterface = document.getElementById('chatInterface')
        const ticketsHeader = document.getElementById('ticketsHeader')

        document.body.classList.remove("keyboard")
        inputContainerRef.current.style.position = "fixed";
        inputContainerRef.current.style.bottom = "0px";
        inputContainerRef.current.removeEventListener("wheel", (e) => { 
            e.preventDefault();
            e.stopPropagation();
        
            return false;
        });
        chatInterface.removeEventListener("wheel", (e) => { 
            e.preventDefault();
            e.stopPropagation();
        
            return false;
        });
        ticketsHeader.removeEventListener("wheel", (e) => { 
            e.preventDefault();
            e.stopPropagation();
        
            return false;
        });
    }


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
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
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
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
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
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
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
        <div className='chat__input__container'
            ref={inputContainerRef}
        >
            <div
                id='inputGroup'
                className={`col-md-10 col-12 ${!allowUserInput ? "disallowed__section" : ""
                    }`}
                title={!allowUserInput ? "Not Allowed" : "Type a message"}
            >
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
                            <div className='chat__input--group--inputs'>
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
                            </div>
                            <div>
                                <Button
                                    type='submit'
                                    text={"Send"}
                                    icon={<ReactSVG src={imageLinks?.svg?.send} />}
                                    classType='default'
                                    otherClass={`send__button ${!btnDisabled ? "active" : ""
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
        </div>

    );
};

export default LiveChatInput;

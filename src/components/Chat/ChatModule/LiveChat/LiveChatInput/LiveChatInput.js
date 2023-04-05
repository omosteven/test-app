import React, { useState, useEffect, useContext, useRef } from "react";
import { useSelector } from "react-redux";
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
import {
    getCurrentFormInputRules,
    getErrorMessage,
    getNumberPrefix,
    isDeviceMobileTablet,
} from "../../../../../utils/helper";
import { formInputTypes } from "../MessageBody/Messages/enums";
import { IMAGE } from "./UploadIcons/enum";
import "./LiveChatInput.scss";
import UploadedFiles from "./UploadIcons/UploadedFiles/UploadedFiles";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import RelaxedSelectUI from "components/ui/InputTypes/SelectUI/RelaxedSelectUI/RelaxedSelectUI";
import DatePickerWrapper from "./DatePickerWrapper/DatePickerWrapper";
import { datePickerStages } from "./DatePickerWrapper/enum";

const { DATE_VALUE, PICK_DATE } = datePickerStages;
const { LOADING, ERROR, DATAMODE } = dataQueryStatus;
const { TEXT, NUMERIC, LONG_TEXT, DATE, MULTISELECT } = formInputTypes;

const { RELAXED } = defaultTemplates;

const LiveChatInput = ({
    handleNewMessage,
    handleScrollChatToBottom,
    ticketId,
    fetchingInputStatus,
    allowUserInput,
    inputType,
    currentFormElement,
    disableInput,
    uploads,
    updateUploads,
    isDateFormElement,
    mssgSendStatus,
}) => {
    const [isTyping, inputRef] = useIsTyping();
    const inputContainerRef = useRef();

    const [selectedMedia, setSelectedMedia] = useState({});
    const [errors, setErrors] = useState({});
    const [errorMssg, setErrorMssg] = useState("");
    const [status, setStatus] = useState();
    const [showModal, toggleModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const isDisabled = fetchingInputStatus || !allowUserInput;

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

    const socket = useContext(SocketContext);

    const clearUserInput = () => {
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
    };

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
        if (
            request?.fileAttachments[0]?.fileAttachmentUrl ||
            isDateFormElement ||
            isFormElementMultiselect ||
            request?.message?.length > 0
        ) {
            setLoading(true);
        } else {
            setLoading(false);
            return;
        }

        handleNewMessage(request, clearUserInput);
        setErrors((prev) => ({ ...prev, file: "" }));
    };

    const showIphoneKeyboard = () => {
        // Moves the real input on-screen
        const chatInterface = document.getElementById("chatInterface");
        const ticketsHeader = document.getElementById("ticketsHeader");

        inputContainerRef.current.style.position = "absolute";
        inputContainerRef.current.style.zIndex = 999;
        inputContainerRef.current.style.left = "0px";
        inputContainerRef.current.style.bottom = "0px";

        inputContainerRef.current.addEventListener("wheel", (e) => {
            e.preventDefault();
        });
        chatInterface.addEventListener("wheel", (e) => {
            e.preventDefault();
        });
        ticketsHeader.addEventListener("wheel", (e) => {
            e.preventDefault();
        });

        return "";
    };

    const handleAndroidKeyboard = () => {
        window.addEventListener("resize", (e) => {
            const messageBody = document.getElementById("messageBody");
            messageBody.style.scrollBehavior = "smooth";
            messageBody.scrollTop = messageBody.scrollHeight;
        });
    };

    const handleInputFocus = () => {
        const iOS =
            !window.MSStream && /iPad|iPhone|iPod/.test(navigator.userAgent); // fails on iPad iOS 13
        if (iOS) {
            document.body.classList.add("keyboard");
            showIphoneKeyboard();
        } else {
            if (isDeviceMobileTablet()) {
                handleAndroidKeyboard();
            }
        }
    };

    const handleInputBlur = () => {
        handleScrollChatToBottom();

        const chatInterface = document.getElementById("chatInterface");
        const ticketsHeader = document.getElementById("ticketsHeader");

        document.body.classList.remove("keyboard");
        inputContainerRef.current.style.position = "fixed";
        inputContainerRef.current.style.bottom = "0px";
        inputContainerRef.current.removeEventListener("wheel", (e) => {
            e.preventDefault();
            e.stopPropagation();

            return false;
        });
        chatInterface?.removeEventListener("wheel", (e) => {
            e.preventDefault();
            e.stopPropagation();

            return false;
        });
        ticketsHeader?.removeEventListener("wheel", (e) => {
            e.preventDefault();
            e.stopPropagation();

            return false;
        });
    };

    const handleTyping = (e) => {
        handleScrollChatToBottom();

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

    const [datePickerStage, setDatePickerStage] = useState(DATE_VALUE);

    const renderBasedOnInputType = () => {
        const { formElementPlaceholder, formElementOptions, options, rules } =
            currentFormElement || {};

        const {
            maxLength,
            minLength,
            isEmail,
            isLink,
            max,
            // pattern,
            minDate,
            maxDate,
        } = getCurrentFormInputRules(rules, inputType);

        const numberPrefix = getNumberPrefix(rules);

        // console.log({ isEmail, isLink, pattern });

        const textInputType = isEmail ? "email" : isLink ? "url" : "text";

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
                        // onClick={() => handleScrollChatToBottom()}
                        hideLabel={true}
                        ref={inputRef}
                        maxLength={maxLength?.ruleConstraint}
                        minLength={minLength?.ruleConstraint}
                        type={textInputType}
                        // pattern={
                        //     isLink?.ruleConstraint &&
                        //     `${isLink?.ruleConstraint}/.*`
                        // }
                        // pattern={pattern}
                        // pattern={`/^$|(http(s)?:\/\/.)?(\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g`}
                        max={max?.ruleConstraint}
                        disabled={
                            isDisabled || inputType === IMAGE || disableInput
                        }
                        showPrefix={inputType === NUMERIC}
                        prefix={inputType === NUMERIC ? numberPrefix : ""}
                    />
                );

            case DATE:
                return (
                    <>
                        {isRelaxedTemplate ? (
                            <DatePickerWrapper
                                stage={datePickerStage}
                                request={request}
                                updateRequest={updateRequest}
                                setDatePickerStage={setDatePickerStage}
                                disabled={disableInput}
                            />
                        ) : (
                            <CustomDatePicker
                                onChange={(date) =>
                                    updateRequest({ ...request, message: date })
                                }
                                disabled={disableInput}
                                minDate={minDate?.ruleConstraint}
                                maxDate={maxDate?.ruleConstraint}
                            />
                        )}
                    </>
                );

            case MULTISELECT:
                const usedArr = options ? options : formElementOptions;
                const selectOptions = usedArr?.map((item) => ({
                    label: item,
                    value: item,
                }));
                return (
                    <>
                        {isRelaxedTemplate ? (
                            <RelaxedSelectUI
                                options={selectOptions}
                                handleChange={(value) =>
                                    updateRequest({
                                        ...request,
                                        message: value,
                                    })
                                }
                            />
                        ) : (
                            <SelectUI
                                options={selectOptions}
                                handleChange={(value) =>
                                    updateRequest({
                                        ...request,
                                        message: value,
                                    })
                                }
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                isDisabled={disableInput}
                                // onClick={() => handleScrollChatToBottom()}
                            />
                        )}
                    </>
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
                        disabled={
                            isDisabled || inputType === IMAGE || disableInput
                        }
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        // onClick={() => handleScrollChatToBottom()}
                        maxLength={maxLength?.ruleConstraint}
                        minLength={minLength?.ruleConstraint}
                        // pattern={pattern}
                        max={max?.ruleConstraint}
                    />
                );
        }
    };

    const handleDatePickerStage = () => {
        setDatePickerStage(DATE_VALUE);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendNewMessage();
    };

    const btnDisabled =
        uploads?.length > 0
            ? status === LOADING || status === ""
            : isDisabled || request?.message === "";

    const { defaultTemplate } = useSelector(
        (state) => state?.chat?.chatSettings
    );

    const isRelaxedTemplate = defaultTemplate === RELAXED;

    const { formElementType } = currentFormElement || {};

    const isFormElementImage = formElementType === IMAGE;

    const isFormElementMultiselect = formElementType === MULTISELECT;

    const isFinalDatePickerStage = datePickerStage === PICK_DATE;

    return (
        <div className={`chat__input__wrapper`} ref={inputContainerRef}>
            <div
                id='inputGroup'
                className={`col-md-10 col-12 ${
                    !allowUserInput ? "disallowed__section" : ""
                }`}
                title={!allowUserInput ? "Not Allowed" : "Type a message"}>
                <form
                    onSubmit={handleSubmit}
                    id='chatInput'
                    className={`
                ${isFormElementMultiselect ? "chatInput-form-select" : ""}`}>
                    {uploads?.length > 0 && (
                        <>
                            {isRelaxedTemplate && isFormElementImage ? (
                                <UploadedFiles
                                    uploads={uploads}
                                    status={status}
                                    handleRemoveFile={handleRemoveFile}
                                    icon={imageLinks?.svg?.attachment2}
                                    handleRetry={(file) =>
                                        handleRetryUpload(file)
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
                            ) : (
                                <UploadPreview
                                    upload={uploads}
                                    status={status}
                                    handleRemoveFile={handleRemoveFile}
                                    handleRetry={(file) =>
                                        handleRetryUpload(file)
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
                        </>
                    )}

                    <div
                        className={
                            isFormElementMultiselect
                                ? ""
                                : "chat__input--container"
                        }>
                        <div className='chat__input--group'>
                            {isRelaxedTemplate &&
                            (isFormElementImage ||
                                isFinalDatePickerStage ||
                                isFormElementMultiselect) ? (
                                <>
                                    {isDateFormElement ||
                                    isFormElementMultiselect ? (
                                        <> {renderBasedOnInputType()}</>
                                    ) : (
                                        uploads?.length === 0 && (
                                            <UploadIcons
                                                upload={uploads}
                                                updateUpload={updateUploads}
                                                isDisabled={isDisabled}
                                                setErrors={setErrors}
                                                showModal={showModal}
                                                toggleModal={toggleModal}
                                                handleUpload={handleUpload}
                                                selectedMedia={selectedMedia}
                                                icon={
                                                    imageLinks?.svg?.attachment2
                                                }
                                                currentFormElement={
                                                    currentFormElement
                                                }
                                                label={"Upload File"}
                                            />
                                        )
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className='chat__input--group--inputs'>
                                        {!isRelaxedTemplate && (
                                            <UploadIcons
                                                upload={uploads}
                                                updateUpload={updateUploads}
                                                isDisabled={isDisabled}
                                                setErrors={setErrors}
                                                showModal={showModal}
                                                toggleModal={toggleModal}
                                                handleUpload={handleUpload}
                                                selectedMedia={selectedMedia}
                                                currentFormElement={
                                                    currentFormElement
                                                }
                                            />
                                        )}
                                        {renderBasedOnInputType()}
                                    </div>
                                    <Button
                                        type='submit'
                                        text={"Send"}
                                        icon={
                                            <ReactSVG
                                                src={imageLinks?.svg?.send}
                                            />
                                        }
                                        classType='default'
                                        otherClass={`send__button ${
                                            !btnDisabled ? "active" : ""
                                        } ${
                                            mssgSendStatus === LOADING
                                                ? "active"
                                                : ""
                                        }`}
                                        loading={mssgSendStatus === LOADING}
                                        disabled={
                                            (btnDisabled ||
                                                fetchingInputStatus) &&
                                            mssgSendStatus === LOADING
                                        }
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {(errors?.file || errorMssg) && (
                        <span className='file__error'>
                            {errors?.file || errorMssg}
                        </span>
                    )}
                    {mssgSendStatus === ERROR && (
                        <span className='chat__input__error'>
                            Sorry, an error occurred. Please refresh or try
                            again.
                        </span>
                    )}
                    {isRelaxedTemplate &&
                        (isFormElementImage ||
                            isFinalDatePickerStage ||
                            isFormElementMultiselect) && (
                            <Button
                                type={isDateFormElement ? "button" : "submit"}
                                text={isDateFormElement ? "Save" : "Submit"}
                                classType='primary'
                                otherClass={`chat__input__relaxed__button ${
                                    isDateFormElement
                                        ? "chat__input__date__button"
                                        : ""
                                } ${!btnDisabled ? "active" : ""} ${
                                    isFormElementImage && uploads?.length === 0
                                        ? "chat__input__relaxed__hide-button"
                                        : ""
                                } `}
                                loading={
                                    isFinalDatePickerStage
                                        ? disableInput
                                        : loading && !(mssgSendStatus === ERROR)
                                }
                                disabled={
                                    (btnDisabled ||
                                        fetchingInputStatus ||
                                        status === LOADING) &&
                                    !(mssgSendStatus === ERROR)
                                }
                                onClick={
                                    isDateFormElement && handleDatePickerStage
                                }
                            />
                        )}
                </form>
                <PoweredBy />
            </div>
        </div>
    );
};

export default LiveChatInput;

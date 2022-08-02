import { useState, useEffect, useContext } from "react";
import { ReactSVG } from "react-svg";
import imageLinks from "../../../../../assets/images";
import { SocketContext } from "../../../../../lib/socket/context/socket";
import {
    IS_NOT_TYPING,
    IS_TYPING,
    SEND_CUSTOMER_CONVERSATION_REPLY,
} from "../../../../../lib/socket/events";
import { Button, Input, Textarea } from "../../../../ui";
// import DatePicker from "../../../../ui/InputTypes/DatePicker/DatePicker";
import SelectUI from "../../../../ui/InputTypes/SelectUI/SelectUI";
import { formInputTypes } from "../MessageBody/Messages/Message/enums";
import { useIsTyping } from "use-is-typing";
// import apiRoutes from "../../../../../lib/api/apiRoutes";
// import API from "../../../../../lib/api";
// import SuggestedConvos from "../SuggestedConvos/SuggestedConvos";
// import { useSelector } from "react-redux";
// import { ISSUE_DISCOVERY } from "../../../CustomerTicketsContainer/CustomerTickets/common/TicketStatus/enum";
import PoweredBy from "../../../../common/PoweredBy/PoweredBy";
import UploadIcons from "./UploadIcons/UploadIcons";

const { TEXT, NUMERIC, LONG_TEXT, DATE, MULTISELECT } = formInputTypes;
const LiveChatInput = ({
    handleNewMessage,
    ticketId,
    triggerAgentTyping,
    fetchingInputStatus,
    allowUserInput,
    inputType,
    currentFormElement,
}) => {
    // const { activeTicket } = useSelector(state => state.tickets)

    const [fetchingConvos, setFetchingConvos] = useState(false);
    // const [showConvos, toggleConvosView] = useState(false);
    // const [suggestedList, setSuggestedList] = useState([]);

    const [isTyping, inputRef] = useIsTyping();

    const [request, updateRequest] = useState({
        message: "",
        fileAttachment: {
            fileAttachmentUrl: "",
            fileAttachmentType: "",
        },
    });
    const [upload, updateUpload] = useState({
        preview: "",
        file: {},
        isLoading: false,
    });

    const isDisabled = fetchingInputStatus || !allowUserInput;

    const socket = useContext(SocketContext);

    const sendNewMessage = () => {
        handleNewMessage(request);
        updateRequest({
            message: "",
            fileAttachment: { fileAttachmentUrl: "", fileAttachmentType: "" },
        });
        updateUpload({
            preview: "",
            file: {},
            isLoading: false,
        });
    };

    // const handleConvoClick = async (conversationId) => {
    //     triggerAgentTyping(true)
    //     toggleConvosView(false)
    //     setFetchingConvos(false)

    //     await setTimeout(function () {
    //         socket.timeout(1000).emit(SEND_CUSTOMER_CONVERSATION_REPLY, { ticketId, conversationId }, (err) => {
    //             if (err) {
    //                 console.log('An erro occured')
    //                 toggleConvosView(false)
    //                 setFetchingConvos(false)
    //                 triggerAgentTyping(false)
    //                 setMessage("")
    //             } else {
    //                 toggleConvosView(false)
    //                 setFetchingConvos(false)
    //                 triggerAgentTyping(false)
    //                 setMessage("")
    //             }

    //         });
    //     }, 5000);

    // }

    // const fetchConvoSuggestions = async () => {
    //     try {
    //         const { ticketPhase } = activeTicket;

    //         if (ticketPhase === ISSUE_DISCOVERY) {
    //             toggleConvosView(false)
    //             setFetchingConvos(true)
    //             // setStatus(LOADING);
    //             // setErrorMssg();
    //             if (message !== "" && message.length > 4) {

    //                 const url = apiRoutes?.investigateMesage;
    //                 const res = await API.get(url, {
    //                     params: {
    //                         search: message
    //                     }
    //                 });
    //                 if (res.status === 200) {
    //                     const {data} = res.data;
    //                     setFetchingConvos(false)

    //                     if (data.length > 0){
    //                         setSuggestedList(data)
    //                         toggleConvosView(true)
    //                     }else {
    //                         toggleConvosView(false)
    //                         setSuggestedList(data)
    //                     }

    //                 }
    //             }
    //         } else {
    //             toggleConvosView(false)

    //         }

    //     } catch (err) {
    //         toggleConvosView(false)
    //         setFetchingConvos(false)
    //     }
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
        // if (isTyping == false) {
        //     fetchConvoSuggestions()
        // }
        socket.emit(decidedEvent, { ticketId });
    }, [isTyping]);

    useEffect(() => {
        return () => {
            socket.emit(IS_NOT_TYPING, { ticketId });
        };
    }, []);

    const renderBasedOnInputType = () => {
        const { formElementPlaceholder, formElementOptions, options } =
            currentFormElement || {};
        switch (inputType) {
            case TEXT:
            case NUMERIC:
            case DATE:
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
                        hideLabel={true}
                        ref={inputRef}
                        isLoading={fetchingConvos}
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

            // case DATE:
            //     return (
            //         <DatePicker onChange={(date, dateString) => setMessage(dateString)} />
            //     )

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
                        isLoading={fetchingConvos}
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
            <form
                onSubmit={handleSubmit}
                id='chatInput'
                className='chat__input--group'>
                <UploadIcons
                    updateRequest={updateRequest}
                    upload={upload}
                    updateUpload={updateUpload}
                />
                {renderBasedOnInputType()}
                <Button
                    type='submit'
                    text={"Send"}
                    icon={<ReactSVG src={imageLinks?.svg?.send} />}
                    classType='default'
                    otherClass={`send__button ${!btnDisabled ? "active" : ""}`}
                    disabled={btnDisabled || fetchingInputStatus}
                />
            </form>
            <PoweredBy />
        </div>
    );
};

export default LiveChatInput;

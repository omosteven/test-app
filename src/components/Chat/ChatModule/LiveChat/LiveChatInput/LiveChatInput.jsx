import { useState, useEffect, useContext } from "react";
import { ReactSVG } from "react-svg";
import imageLinks from "../../../../../assets/images";
import { SocketContext } from "../../../../../lib/socket/context/socket";
import { IS_NOT_TYPING, IS_TYPING } from "../../../../../lib/socket/events";
import { Button, Input } from "../../../../ui";
import SelectUI from "../../../../ui/InputTypes/SelectUI/SelectUI";
import { formInputTypes } from "../MessageBody/Messages/Message/enums";
import { useIsTyping } from 'use-is-typing';
import PoweredBy from "../../../../common/PoweredBy/PoweredBy";
import CustomDatePicker from "../../../../ui/InputTypes/DatePicker/DatePicker";


const { TEXT, NUMERIC, LONG_TEXT, DATE, MULTISELECT } = formInputTypes
const LiveChatInput = ({ handleNewMessage, ticketId, fetchingInputStatus, allowUserInput, inputType, currentFormElement }) => {
    const [isTyping, inputRef] = useIsTyping();

    const [message, setMessage] = useState("");

    const isDisabled = fetchingInputStatus || !allowUserInput;

    const socket = useContext(SocketContext);

    const sendNewMessage = () => {
        handleNewMessage(message);
        setMessage("")
    }

    // const handleInputFocus = () => {
    //     document.getElementById('inputGroup').scrollIntoView({ behavior: 'smooth', block: 'end' });
    // }

   
    const handleTyping = (e) => {
        let { value } = e.target;
        if (inputType === NUMERIC) {
            console.log(value.replace(/\D/g, ""));
            value = value.replace(/\D/g, "");
        }
        setMessage(value)
    }

    useEffect(() => {
        const decidedEvent = isTyping ? IS_TYPING : IS_NOT_TYPING
        socket.emit(decidedEvent, { ticketId })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTyping]);

    useEffect(() => {
        return () => {
            socket.emit(IS_NOT_TYPING, { ticketId })
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderBasedOnInputType = () => {
        const { formElementPlaceholder, formElementOptions, options } = currentFormElement || {}
        switch (inputType) {
            case TEXT:
            case NUMERIC:
            case LONG_TEXT:
                return (
                    <Input
                        placeholder={formElementPlaceholder ? formElementPlaceholder : "Type message here"}
                        inputClass="w-100 border-0"
                        value={message}
                        onChange={handleTyping}
                        grpClass="w-100"
                        label="Chat"
                        // onFocus={handleInputFocus}
                        hideLabel={true}
                        ref={inputRef}
                        disabled={isDisabled}
                    />
                )
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
                    <CustomDatePicker onChange={(date) => setMessage(date)} />
                )

            case MULTISELECT:
                const usedArr = options ? options : formElementOptions
                const selectOptions = usedArr?.map((item) => ({ label: item, value: item }))
                return <SelectUI options={selectOptions} handleChange={(value) => setMessage(value)} />

            default:
                return <Input
                    placeholder="Type message here"
                    inputClass="w-100 border-0"
                    value={message}
                    onChange={handleTyping}
                    grpClass="w-100"
                    label="Chat"
                    ref={inputRef}
                    hideLabel={true}
                    disabled={isDisabled}
                />
        }
    }

    const handleSubmit = e => {
        e.preventDefault();
        sendNewMessage()
    }

    const btnDisabled = isDisabled || message === "";

    return (
        <div id="inputGroup" className="col-md-10 col-12">
        {/* {showConvos && <SuggestedConvos data={suggestedList} handleConvoClick={handleConvoClick} />} */}
        <form onSubmit={handleSubmit} id="chatInput" className="chat__input--group">
            {renderBasedOnInputType()}
            <Button
                type="submit"
                text={"Send"}
                icon={<ReactSVG src={imageLinks?.svg?.send} />}
                classType="default"
                otherClass={`send__button ${!btnDisabled ? 'active' : ''}`}
                disabled={message === "" || fetchingInputStatus}
            />
        </form>
        <PoweredBy />
    </div>
    );
};

export default LiveChatInput;

import React from "react";
import { useDispatch } from "react-redux";
import RemoveMessage from "./RemoveMessage/RemoveMessage";
import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";
import { deleteTicketsMessages } from "store/tickets/actions";

const SuccessMessage = ({ data }) => {
    const { messageId, ticketId, messageHeader, messageContent } = data;

    const dispatch = useDispatch();

    const handleRemoveMessage = () => {
        dispatch(
            deleteTicketsMessages({
                messageId,
                ticketId,
            })
        );
    };

    return (
        <div
            id={messageId ? messageId : ""}
            className={`message__group received`}>
            <div className={`message__group--content`}>
                <div className={`message__content success__message`}>
                    <div className='icon__container'>
                        <ReactSVG src={imageLinks?.svg?.attention} />
                    </div>
                    <div className='success__message__content'>
                        <h6 className='success__message__title'>
                            {messageHeader}
                        </h6>
                        <p className='success__message__text'>
                            {messageContent}
                        </p>
                    </div>
                </div>
                <RemoveMessage onClick={handleRemoveMessage} />
            </div>
        </div>
    );
};

export default SuccessMessage;

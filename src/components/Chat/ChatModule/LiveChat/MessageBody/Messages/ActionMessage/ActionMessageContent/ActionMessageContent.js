import CustomRatings from "components/ui/CustomRatings/CustomRatings";
import React from "react";
import { ReactSVG } from "react-svg";
import imageLinks from "../../../../../../../../assets/images";
import { ADD_EMAIL_ADDRESS } from "../../enums";
import ActionAddEmail from "./ActionAddEmail/ActionAddEmail";

const ActionMessageContent = ({
    messageContent,
    messageHeader,
    messageActionType,
    rating,
    handleRating,
    handleVerifyAction,
    requestRatings,
}) => {
    return (
        <>
            <div className='message__content info__action'>
                {messageHeader && (
                    <div className='action__header'>
                        <ReactSVG src={imageLinks?.svg?.attention} />
                        <h6>{messageHeader}</h6>
                    </div>
                )}
                <div className='message'>
                    <div>{messageContent}</div>
                    {requestRatings && (
                        <CustomRatings {...{ rating, handleRating }} />
                    )}
                </div>
            </div>
            {messageActionType === ADD_EMAIL_ADDRESS && (
                <ActionAddEmail handleVerifyAction={handleVerifyAction} />
            )}
        </>
    );
};

export default ActionMessageContent;

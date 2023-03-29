import React from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomRatings from "components/ui/CustomRatings/CustomRatings";
import { ReactSVG } from "react-svg";
import imageLinks from "../../../../../../../../assets/images";
import { ADD_EMAIL_ADDRESS, INPUT_NEEDED } from "../../enums";
import ActionAddEmail from "./ActionAddEmail/ActionAddEmail";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import { deleteTicketsMessages } from "store/tickets/actions";

const { WORKMODE, RELAXED } = defaultTemplates;

const ActionMessageContent = ({
    messageContent,
    messageId,
    messageHeader,
    messageActionType,
    rating,
    handleRating,
    handleVerifyAction,
    requestRatings,
    ticketId,
    messages,
}) => {
    const { defaultTemplate } = useSelector(
        (state) => state?.chat?.chatSettings
    );
    const dispatch = useDispatch();

    const handleRemoveReminder = () => {
        dispatch(
            deleteTicketsMessages({
                messageId,
                ticketId,
            })
        );
    };

    const isRelaxedTemplate = defaultTemplate === RELAXED;
    const isWorkModeTemplate = defaultTemplate === WORKMODE;

    const showCautionIcon =
        (isRelaxedTemplate && messageActionType === INPUT_NEEDED) ||
        isWorkModeTemplate;

    const lastMessage = messages[messages.length - 1];

    const showAddEmailAddress =
        messageActionType === ADD_EMAIL_ADDRESS &&
        lastMessage?.messageActionType === ADD_EMAIL_ADDRESS;

    return (
        <>
            <div
                className={`message__content info__action ${
                    showCautionIcon ? "input__needed" : ""
                }`}>
                {messageHeader && (
                    <div className='action__header'>
                        <div className='action__header__text__container'>
                            {showCautionIcon && (
                                <ReactSVG
                                    src={imageLinks?.svg?.attention}
                                    className='action__attention'
                                />
                            )}
                            <h6 className='action__header__text'>
                                {messageHeader}
                            </h6>
                        </div>
                        {defaultTemplate === RELAXED &&
                            messageActionType === INPUT_NEEDED && (
                                <ReactSVG
                                    src={imageLinks?.svg?.cancel}
                                    className='remove__action'
                                    onClick={handleRemoveReminder}
                                />
                            )}
                    </div>
                )}
                <div className='message'>
                    <div
                        className={`action__message ${
                            !messageHeader ? "action__message__bold" : ""
                        }`}>
                        {messageContent}
                    </div>
                    {requestRatings && (
                        <CustomRatings
                            {...{ rating, handleRating }}
                            otherClass='template__ratings'
                        />
                    )}
                </div>
            </div>
            {showAddEmailAddress && (
                <ActionAddEmail handleVerifyAction={handleVerifyAction} />
            )}
        </>
    );
};

export default ActionMessageContent;

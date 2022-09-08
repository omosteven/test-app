import CustomRatings from 'components/ui/CustomRatings/CustomRatings';
import React from 'react';
import { ReactSVG } from 'react-svg';
import imageLinks from '../../../../../../../../assets/images';
import { messageActionTypes, TICKET_CLOSED_ALERT } from '../../enums';

const ActionMessageContent = ({ messageContent, messageActionType, rating, handleRating }) => {
    return (
        <div className='message__content info__action'>
            <div className="action__header">
                <ReactSVG src={imageLinks?.svg?.attention} />
                <h6>{messageActionTypes?.[messageActionType]?.title}</h6>
            </div>
            <div className='message'>
                <div>{messageContent}</div>
                {
                    messageActionType === TICKET_CLOSED_ALERT && <CustomRatings {...{ rating, handleRating }} />
                }
            </div>
        </div>
    );
};

export default ActionMessageContent;
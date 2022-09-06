import React from 'react';
import { ReactSVG } from 'react-svg';
import imageLinks from '../../../../../../../../assets/images';
import { messageActionTypes } from '../../enums';

const ActionMessageContent = ({ messageContent, messageActionType }) => {
    return (
        <div className='message__content info__action'>
            <div className="action__header">
                <ReactSVG src={imageLinks?.svg?.attention} />
                <h6>{messageActionTypes?.[messageActionType]?.title}</h6>
            </div>
            <div className='message'>{messageContent}</div>
        </div>
    );
};

export default ActionMessageContent;
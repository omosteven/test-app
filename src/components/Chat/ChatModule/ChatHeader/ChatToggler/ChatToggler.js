import React from 'react';
import { ReactSVG } from 'react-svg';
import imageLinks from '../../../../../assets/images';

const ChatToggler = ({...restProps}) => {
    return (
        <div className="chat__toggler" {...restProps}>
            <ReactSVG src={imageLinks?.svg?.leftArrow} />
            <span>Chat</span>
        </div>
    );
};

export default ChatToggler;
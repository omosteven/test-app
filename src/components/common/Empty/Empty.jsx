import React from 'react';
import { ReactSVG } from 'react-svg';
import imageLinks from '../../../assets/images';

const Empty = ({ message, otherClassNames }) => {
    return (
        <div className={`empty__chat ${otherClassNames ? otherClassNames : ''}`}>
            <ReactSVG src={imageLinks.svg.chat_icon} />
            <p>
                {message}
            </p>
        </div>
    );
};

export default Empty;
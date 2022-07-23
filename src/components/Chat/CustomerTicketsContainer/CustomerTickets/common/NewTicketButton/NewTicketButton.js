import React from 'react';
import { ReactSVG } from 'react-svg';
import imageLinks from '../../../../../../assets/images';
import { Button } from '../../../../../ui';

const NewTicketButton = ({ handleClick, otherClassNames}) => {
    return (
        <Button
            icon={<ReactSVG src={imageLinks.svg.add} className="icon" />}
            text="New conversation"
            otherClass={`new__convo ${otherClassNames ? otherClassNames : ""}`}
            onClick={handleClick}
        />
    );
};

export default NewTicketButton;
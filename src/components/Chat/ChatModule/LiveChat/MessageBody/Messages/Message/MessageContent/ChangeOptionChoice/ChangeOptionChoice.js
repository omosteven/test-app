import React from "react";
import "./ChangeOptionChoice.scss";

const ChangeOptionChoice = ({ onClick }) => {
    return (
        <span className='change__option__choice' onClick={onClick}>
            Tap to change option
        </span>
    );
};

export default ChangeOptionChoice;

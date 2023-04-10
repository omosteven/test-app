import React from "react";
import imageLinks from "assets/images";
import { ReactSVG } from "react-svg";
import "./CloseVerifyForm.scss";

const CloseVerifyForm = ({ handleVerifyAction }) => {
    return (
        <ReactSVG
            src={imageLinks.svg.leftArrow}
            className='close__verify__icon'
            onClick={() => handleVerifyAction()}
        />
    );
};

export default CloseVerifyForm;

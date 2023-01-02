import React from "react";
import "./ActionAddEmail.scss";

const ActionAddEmail = ({ handleVerifyAction }) => {
    return (
        <div className='action__add__email'>
            <div
                className='add__email branch__option'
                onClick={handleVerifyAction}>
                Add email address
            </div>
        </div>
    );
};

export default ActionAddEmail;

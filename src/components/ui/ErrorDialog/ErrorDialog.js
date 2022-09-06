import React from "react";
import PropTypes from "prop-types";
import "./ErrorDialog.scss";

export const ErrorDialog = ({ show, message, hide }) => {
    if (!show) {
        return null;
    }

    return (
        <div className='error d-flex justify-content-between mb-3'>
            <p className='error__message mb-0'>{message}</p>

            <button
                type='button'
                className='error__close-btn'
                title='Dismiss'
                onClick={hide}>
                <i>&times;</i>
            </button>
        </div>
    );
};

ErrorDialog.propTypes = {
    show: PropTypes.bool,
    message: PropTypes.string,
    hide: PropTypes.func,
};

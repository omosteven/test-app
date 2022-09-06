import React from "react";
import ErrorStateIcon from "assets/svg/-state-icon.svg";

const ModalErrorState = ({ text, buttonText, onClick, onCancel }) => {
    return (
        <div className='px-5 text-center'>
            <img
                src={ErrorStateIcon}
                alt=''
                height='100px'
                className='mt-5 mb-5'
            />

            <p className='mb-5 text-black font-20'>{text}</p>

            <div className='mt-5 d-flex'>
                {onCancel && (
                    <button
                        type='button'
                        className='btn btn--lg btn--secondary btn--bordered mr-4'
                        onClick={onCancel}>
                        Cancel
                    </button>
                )}

                <button
                    type='button'
                    className='btn btn--primary btn--lg'
                    onClick={onClick}>
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default ModalErrorState;

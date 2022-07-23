import React from 'react';
import { Link } from 'react-router-dom';
import SuccessStateIcon from '../../../assets/svg/success-state-icon.svg';

const ModalSuccessState = ({ text, buttonText, redirectUrl, onClick }) => {
    return (
        <div className="px-5 text-center">
            <img
                src={SuccessStateIcon}
                alt=""
                height="100px"
                className="mt-5 mb-4"
            />
            <p className="mb-5 text-black font-20">{text}</p>

            {redirectUrl ? (
                <Link to={redirectUrl} className="btn btn--primary btn--lg">
                    {buttonText}
                </Link>
            ) : (
                <button className="btn btn--primary btn--lg" onClick={onClick}>
                    {buttonText}
                </button>
            )}
        </div>
    );
};

export default ModalSuccessState;

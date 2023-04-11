import React from "react";
import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";
import "./BannerMessage.scss";

const BannerMessage = ({ children, onClick, onClose }) => {
    return (
        <div onClick={onClick} className='banner__message'>
            <div>
                <ReactSVG src={imageLinks.svg.info} />
                <span className='banner__message__text'>{children}</span>
            </div>
            {onClose && (
                <ReactSVG
                    src={imageLinks.svg.cancel}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className='close__banner__message'
                />
            )}
        </div>
    );
};

export default BannerMessage;

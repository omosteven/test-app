import React from "react";
import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";
import "./BannerMessage.scss";

const BannerMessage = ({
    children,
    onClick,
    onClose,
    isClickable,
    isCloseable,
}) => {
    return (
        <div
            onClick={() => (isClickable ? onClick() : "")}
            className='banner__message'>
            <div>
                <ReactSVG src={imageLinks.svg.info} />
                <span className='banner__message__text'>{children}</span>
            </div>
            {isCloseable && (
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

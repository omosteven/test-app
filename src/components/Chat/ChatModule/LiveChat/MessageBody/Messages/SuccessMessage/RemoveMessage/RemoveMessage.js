import React from "react";
import "./RemoveMessage.scss";

const RemoveMessage = ({ onClick }) => {
    return (
        <span className='remove__message' onClick={onClick}>
            Tap to remove
        </span>
    );
};

export default RemoveMessage;

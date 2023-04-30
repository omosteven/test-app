import React from "react";
import "./PinnedConversation.scss";
import imageLinks from "assets/images";
import { ReactSVG } from "react-svg";

const PinnedConversation = ({ issueTitle, onClick }) => {
    return (
        <div className='pinned__conversation' onClick={onClick}>
            <span>{issueTitle}</span>
            <ReactSVG src={imageLinks?.svg?.blackPlusIcon} />
        </div>
    );
};

export default PinnedConversation;

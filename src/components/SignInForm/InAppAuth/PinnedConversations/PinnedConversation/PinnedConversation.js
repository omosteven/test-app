import React from "react";
import "./PinnedConversation.scss";
import imageLinks from "assets/images";
import { ReactSVG } from "react-svg";

const PinnedConversation = ({ issueTitle, onClick, otherClass }) => {
    return (
        <div
            className={`pinned__conversation ${otherClass ? otherClass : ""}`}
            onClick={onClick}>
            <span>{issueTitle}</span>
            <ReactSVG
                src={imageLinks?.svg?.add}
                className='pinned__conversation__hide-dark-icon'
            />
            <ReactSVG
                src={imageLinks?.svg?.blackPlusIcon}
                className='pinned__conversation__hide-white-icon'
            />
        </div>
    );
};

export default PinnedConversation;

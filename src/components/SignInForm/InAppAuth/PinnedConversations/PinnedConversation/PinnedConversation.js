import React from "react";
import "./PinnedConversation.scss";

const PinnedConversation = ({ issueTitle, onClick, otherClass }) => {
    return (
        <div
            className={`pinned__conversation ${otherClass ? otherClass : ""}`}
            onClick={onClick}>
            <span>{issueTitle}</span>
            <div className='pinned__conversation__add-plus'>+</div>
        </div>
    );
};

export default PinnedConversation;

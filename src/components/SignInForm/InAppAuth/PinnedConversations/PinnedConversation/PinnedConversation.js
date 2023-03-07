import React from "react";
import "./PinnedConversation.scss";

const PinnedConversation = ({ issueTitle, onClick }) => {
    return (
        <div className='pinned__conversation' onClick={onClick}>
            {issueTitle}
        </div>
    );
};

export default PinnedConversation;

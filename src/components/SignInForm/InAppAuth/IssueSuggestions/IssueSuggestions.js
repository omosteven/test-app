import React from "react";
import IssueSuggestion from "./IssueSuggestion/IssueSuggestion";
import "./IssueSuggestions.scss";

const IssueSuggestions = ({ title }) => {
    return (
        <div className='issues__suggestions'>
            <h3 className='issues__suggestions__title'>{title}</h3>
            <div className='issues__suggestions__list'>
                <IssueSuggestion issueTitle='I’m having issues with my withdrawal' />
                <IssueSuggestion issueTitle='I have payment issues' />{" "}
                <IssueSuggestion issueTitle='I can’t login' />
            </div>
        </div>
    );
};

export default IssueSuggestions;

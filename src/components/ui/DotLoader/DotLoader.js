import React from "react";
import "./DotLoader.scss";

export const DotLoader = ({background = true}) => {
    return (
        <div className={`dot__loader ${background ? 'dot__loader__background' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
};

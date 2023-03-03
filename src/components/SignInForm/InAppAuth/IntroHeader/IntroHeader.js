import React from "react";
import "./IntroHeader.scss";

const IntroHeader = ({ title, subtitle, text }) => {
    return (
        <>
            {title && <h1 className='intro__title'>{text}</h1>}
            {subtitle && <h2 className='intro__subtitle'>{text}</h2>}
        </>
    );
};

export default IntroHeader;

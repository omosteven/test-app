import React from "react";

const CompanyChatLogo = ({ src, alt, className, name }) => {
    return (
        <>
            <img src={src} alt={alt} layout='fill' className={className} />{" "}
            {name && <span className='workspace__agent__name'>{name}</span>}
        </>
    );
};

export default CompanyChatLogo;

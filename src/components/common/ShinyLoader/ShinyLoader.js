import React from "react";

const ShinyLoader = ({ width, height, customClass, key }) => {
    return (
        <div
            className={`shiny__line ${customClass ? customClass : ""}`}
            style={{ width, height }}
            key={key}></div>
    );
};

ShinyLoader.default = {
    width: "20px",
    height: "10px",
};


export default ShinyLoader;

import React from "react";
import "./SmallLoader.scss";

const SmallLoader = ({ otherClassName }) => (
    <div
        className={`lds-spinner-small ${otherClassName ? otherClassName : ""}`}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
);

export default SmallLoader;

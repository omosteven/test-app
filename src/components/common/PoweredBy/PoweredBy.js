import React from "react";
import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";
import "./PoweredBy.scss";

const PoweredBy = () => (
    <div className='powered__by'>
        <ReactSVG src={imageLinks.svg.logo} />
    </div>
);

export default PoweredBy;

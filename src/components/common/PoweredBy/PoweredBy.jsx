import React from 'react';
import { ReactSVG } from 'react-svg';
import imageLinks from '../../../assets/images';

const PoweredBy = () => (
    <div className='powered__by'>
        {/* <span> Powered by</span> */}
        <ReactSVG src={imageLinks.svg.logo} />
    </div>
);

export default PoweredBy;
import React from "react";

const SmallLoader = ({ otherClassName }) => (
    <div className={`lds-spinner-small ${otherClassName ? otherClassName : ''}`}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
)

export default SmallLoader;

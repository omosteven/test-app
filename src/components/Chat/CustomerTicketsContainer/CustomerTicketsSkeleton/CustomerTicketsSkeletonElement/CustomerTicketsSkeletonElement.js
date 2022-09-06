import React from "react";
import ShinyLoader from "../../../../common/ShinyLoader/ShinyLoader";

const CustomerTicketsSkeletonElement = () => (
    <div className='customer__ticket'>
        <ShinyLoader customClass={"mb-2"} width='80px' />
        <ShinyLoader />
    </div>
);

export default CustomerTicketsSkeletonElement;

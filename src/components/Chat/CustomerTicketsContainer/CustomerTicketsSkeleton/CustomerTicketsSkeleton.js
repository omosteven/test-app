import React from "react";
import ShinyLoader from "../../../common/ShinyLoader/ShinyLoader";
import CustomerTicketsSkeletonElement from "./CustomerTicketsSkeletonElement/CustomerTicketsSkeletonElement";
import "./CustomerTicketsSkeleton.scss";

const CustomerTicketsSkeleton = () => {
    return (
        <>
            <div className='customer__tickets__skeleton--container'>
                <CustomerTicketsSkeletonElement />
                <CustomerTicketsSkeletonElement />
            </div>

            <ShinyLoader customClass='ms-auto' width={"200px"} height='35px' />
        </>
    );
};

export default CustomerTicketsSkeleton;

import React from 'react';
import ShinyLoader from '../../../common/ShinyLoader/ShinyLoader';

// const CustomerTicketsSkeletonElement = () => (
//     <div className='customer__ticket mb-1'>
//         <div className='row'>
//             <div className='col-3'>
//                 <ShinyLoader width='40px' height='40px' customClass='rounded-circle' />
//             </div>
//             <div className='col-9'>
//                 <div className='row'>
//                     <div className='col-9 ps-0'>
//                         <ShinyLoader customClass={"mb-2"} />
//                         <ShinyLoader />
//                     </div>
//                     <div className='col-3 px-0'>
//                         <ShinyLoader width={'40px'} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
// )

const CustomerTicketsSkeletonElement = () => (
    <div className='customer__ticket'>
        <ShinyLoader customClass={"mb-2"} width='80px' />
        <ShinyLoader />
    </div>
)

const CustomerTicketsSkeleton = () => {
    return (
        <>
            <div className="customer__tickets--container">
                <CustomerTicketsSkeletonElement />
                <CustomerTicketsSkeletonElement />
            </div>

            <ShinyLoader customClass="ms-auto" width={"200px"} height="35px" />
        </>
    );
};

export default CustomerTicketsSkeleton;
import React from 'react';
import { DatePicker } from 'antd';

const CustomDatePicker = ({onChange}) => {
    return (
        <>
            <DatePicker onChange={onChange}/>
        </>
    );
};

export default CustomDatePicker;
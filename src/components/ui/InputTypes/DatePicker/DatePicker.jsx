import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({onChange}) => {
    return (
        <>
            <DatePicker onChange={onChange}/>
        </>
    );
};

export default CustomDatePicker;
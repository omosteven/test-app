import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({ onChange }) => {
    return (
        <div className={`form-group`}>
            <DatePicker
                onChange={onChange}
                className="form-control"
                placeholderText="Choose a date"
                popperPlacement="top-start"
                portalId="root"
            />
        </div>
    );
};

export default CustomDatePicker;
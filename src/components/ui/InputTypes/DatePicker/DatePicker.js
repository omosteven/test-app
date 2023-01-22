import moment from "moment";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({ onChange, ...rest }) => {
    const [selectedDate, setSelectedDate] = useState();
    return (
        <div className={`form-group`}>
            <DatePicker
                onChange={(date) => {
                    setSelectedDate(date);
                    let dateString = moment(date).format("L");
                    onChange(dateString);
                }}
                className='form-control'
                placeholderText='Choose a date'
                popperPlacement='top-start'
                portalId='root'
                selected={selectedDate}
                {...rest}
            />
        </div>
    );
};

export default CustomDatePicker;

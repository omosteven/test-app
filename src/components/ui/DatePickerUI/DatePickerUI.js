import moment from "moment";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./DatePicker.scss";

const DatePickerUI = ({ onChange }) => {
    const [selectedDate, setSelectedDate] = useState();
    return (
        <>
            <div>
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
                />
            </div>
        </>
    );
};

export default DatePickerUI;

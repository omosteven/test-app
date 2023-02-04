import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { localeDate, getDateAndMonth } from "utils/helper";
import "./RelaxedDatePicker.scss";

const RelaxedDatePicker = ({
    onChange,
    toggleDatepicker,
    minDate,
    maxDate,
    ...rest
}) => {
    const [selectedDate, setSelectedDate] = useState("");
    const [formattedDate, setFormattedDate] = useState({});

    return (
        <div className='relaxed-date-picker'>
            <div className='relaxed-date-picker__header'>
                <span>Select date</span>
                {/* <span>
                    <ReactSVG
                        src={imageLinks?.svg?.cancel}
                        className='relaxed-date-picker__close'
                        onClick={() => toggleDatepicker(false)}
                    />
                </span> */}
            </div>
            <div className='relaxed-date-picker__date_segment'>
                <DatePicker
                    open={true}
                    onChange={(date) => {
                        setSelectedDate(date);
                        let dateString = localeDate(date);
                        onChange(dateString);
                        setFormattedDate(getDateAndMonth(date));
                    }}
                    className='relaxed-date-picker__date'
                    placeholderText='Choose a date'
                    popperPlacement='bottom'
                    selected={selectedDate}
                    fixedHeight
                    {...rest}
                    minDate={new Date(minDate)}
                    maxDate={new Date(maxDate)}
                />
            </div>
            <div className='relaxed-date-picker__values'>
                <div className='date-picker__value'>
                    <span>
                        {formattedDate?.date ? formattedDate?.date : "Day"}
                    </span>
                </div>
                <div className='date-picker__value'>
                    <span>
                        {formattedDate?.month ? formattedDate?.month : "Month"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RelaxedDatePicker;

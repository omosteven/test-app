import React from "react";
import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";
import { datePickerStages } from "../enum";
import "./DatePickerField.scss";

const { PICK_DATE } = datePickerStages;

const DatePickerField = ({ request, onClick, loading }) => {
    const { message } = request || {};

    return (
        <div
            className={`date__picker__field ${
                loading ? "--disable__date__picker__field" : ""
            }`}
            onClick={() => onClick(PICK_DATE)}>
            <ReactSVG
                src={imageLinks.svg.calendar}
                className='calendar__icon'
            />
            <div className='date__picker__value'>
                <span className='date__picker__value__text'>
                    {message ? message?.split(",")[0] : "Select Month"}
                </span>
            </div>
            <div className='date__picker__value'>
                <span className='date__picker__value__text'>
                    {message ? message?.split(",")[1] : "Select Day"}
                </span>
            </div>
        </div>
    );
};

export default DatePickerField;

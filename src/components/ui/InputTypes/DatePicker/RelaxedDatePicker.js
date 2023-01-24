import imageLinks from "assets/images";
import { Button } from "components/ui/Button/Button";
import moment from "moment";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ReactSVG } from "react-svg";
import CustomDatePicker from "./DatePicker";
import "./RelaxedDatePicker.scss";

const RelaxedDatePicker = ({ onChange, ...rest }) => {
    const [selectedDate, setSelectedDate] = useState();
    return (
        // <div className={`form-group`}>
        //     <DatePicker
        //         onChange={(date) => {
        //             setSelectedDate(date);
        //             let dateString = moment(date).format("L");
        //             onChange(dateString);
        //         }}
        //         className='form-control'
        //         placeholderText='Choose a date'
        //         popperPlacement='top-start'
        //         portalId='root'
        //         selected={selectedDate}
        //         {...rest}
        //     />
        // </div>
        <div className='relaxed-date-picker'>
            <div className='relaxed-date-picker__header'>
                <span>Select date</span>
                <span>
                    <ReactSVG src={imageLinks?.svg?.cancel} />
                </span>
            </div>
            <div className='relaxed-date-picker__date_segment'>
                {/* <input type='date' i/> */}
                <CustomDatePicker
                    open={true}
                    // onChange={(date) => {
                    //     setSelectedDate(date);
                    //     let dateString = moment(date).format("L");
                    //     onChange(dateString);
                    // }}
                    // className='form-control'
                    className='relaxed-date-picker__date'
                    placeholderText='Choose a date'
                    popperPlacement='top-start'
                    portalId='root'
                    selected={selectedDate}
                    // showMonthYearPicker
                    fixedHeight
                    {...rest}
                />
            </div>
            <div className='relaxed-date-picker__buttons'>
                <Button
                    type='submit'
                    text={"Day"}
                    classType='default'
                    otherClass={`send__button}`}
                />
                <Button
                    type='submit'
                    text={"Month"}
                    classType='default'
                    otherClass={`send__button}`}
                />
            </div>
        </div>
    );
};

export default RelaxedDatePicker;

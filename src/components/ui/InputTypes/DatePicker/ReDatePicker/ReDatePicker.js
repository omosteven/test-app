import React, { useState, useEffect } from "react";
import moment from "moment";
import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";
import "./ReDatePicker.scss";

const ReDatePicker = ({ onChange }) => {
    const [selectedMonth, setSelectedMonth] = useState({
        name: moment().format("MMMM"),
        index: moment().format("M") - 1,
    });

    // const [dates, setDates] = useState([]);
    const [monthDates, setMonthDates] = useState(new Map());
    const [weekdays, setWeekdays] = useState([]);
    const [currentWeekIndex, setCurrentWeekIndex] = useState(2);
    const [selectedDate, setSelectedDate] = useState("");

    const handleGetDates = () => {
        const year = moment().format("YYYY");
        const month = selectedMonth?.index;

        // Get the number of days in the selected month
        const daysInMonth = moment(
            `${year}-${month + 1}`,
            "YYYY-MM"
        ).daysInMonth();

        // Get the first day of the month and set it to the start of the week (Saturday)
        const firstDayOfMonth = moment(`${year}-${month + 1}-01`, "YYYY-MM-DD")
            .startOf("month")
            .startOf("week")
            .day("Saturday");

        const dates = [];

        // Loop through the days in the selected month and add them to the dates array
        for (let i = 0; i < daysInMonth; i++) {
            const date = moment(firstDayOfMonth).add(i, "days");

            dates.push(date.format("dd,DD"));
        }

        // Get the index of the current week (relative to the dates array)
        const currentWeekIndex = Math.floor(
            moment().diff(firstDayOfMonth, "days") / 7
        );

        // Get the weekdays for the current week
        const weekdays = dates.slice(
            currentWeekIndex * 7,
            (currentWeekIndex + 1) * 7
        );
        // console.log(dates, weekdays, currentWeekIndex);

        // setDates(dates);
        setMonthDates(monthDates.set(month, dates));
        setWeekdays(weekdays);
        setCurrentWeekIndex(currentWeekIndex);

        const currentDate = moment().format("dd,DD");
        setSelectedDate(currentDate);
        onChange(`${selectedMonth?.name},${currentDate}`);
    };

    const handleGetSubsequentMonthDates = (monthIndex) => {
        const year = moment().format("YYYY");

        // Get the number of days in the selected month
        const daysInMonth = moment(
            `${year}-${monthIndex + 1}`,
            "YYYY-MM"
        ).daysInMonth();

        // Get the first day of the month and set it to the start of the week (Saturday)
        const firstDayOfMonth = moment(
            `${year}-${monthIndex + 1}-01`,
            "YYYY-MM-DD"
        )
            .startOf("month")
            .startOf("week")
            .day("Saturday");

        const dates = [];

        // Loop through the days in the selected month and add them to the dates array
        for (let i = 0; i < daysInMonth; i++) {
            const date = moment(firstDayOfMonth).add(i, "days");

            dates.push(date.format("dd,DD"));
        }

        // Get the index of the current week (relative to the dates array)
        const currentWeekIndex = Math.floor(
            moment().diff(firstDayOfMonth, "days") / 7
        );

        // Get the weekdays for the current week
        // const weekdays = dates.slice(
        //     currentWeekIndex * 7,
        //     (currentWeekIndex + 1) * 7
        // );
        // console.log(dates, weekdays, currentWeekIndex);

        // setDates(dates);
        setMonthDates(monthDates.set(monthIndex, dates));
        // setWeekdays(weekdays);
        // setCurrentWeekIndex(currentWeekIndex);
    };

    useEffect(() => {
        handleGetDates();
        // eslint-disable-next-line
    }, []);

    const months = [
        {
            name: "January",
            index: 0,
        },
        {
            name: "February",
            index: 1,
        },
        {
            name: "March",
            index: 2,
        },
        {
            name: "April",
            index: 3,
        },
        {
            name: "May",
            index: 4,
        },
        {
            name: "June",
            index: 5,
        },
        {
            name: "July",
            index: 6,
        },
        {
            name: "August",
            index: 7,
        },
        {
            name: "September",
            index: 8,
        },
        {
            name: "October",
            index: 9,
        },
        {
            name: "November",
            index: 10,
        },
        {
            name: "December",
            index: 11,
        },
    ];

    const days = ["Sa", "Su", "Mo", "Tu", "We", "Th", "Fr"];
    console.log({ dd: monthDates });
    // months
    const handleNextMonthNavigation = (currentMonthIndex) => {
        const isEndOfMonthList = months.length - 1 === currentMonthIndex;
        const nextMonthIndex = isEndOfMonthList ? 0 : currentMonthIndex + 1;
        setSelectedMonth({
            name: months[isEndOfMonthList ? 0 : currentMonthIndex + 1]?.name,
            index: nextMonthIndex,
        });
        handleGetSubsequentMonthDates(nextMonthIndex);
    };

    const handlePreviousMonthNavigation = (currentMonthIndex) => {
        const isBeginOfMonthList = currentMonthIndex === 0;
        const previousMonthIndex = isBeginOfMonthList
            ? months.length - 1
            : currentMonthIndex - 1;
        setSelectedMonth({
            name: months[
                isBeginOfMonthList ? months.length - 1 : currentMonthIndex - 1
            ]?.name,
            index: previousMonthIndex,
        });
        handleGetSubsequentMonthDates(previousMonthIndex);
    };

    // weeks
    const handleNextWeekNavigation = (currentWeekIndex) => {
        const skip = (currentWeekIndex - 1) * 7;
        const week = currentWeekIndex * 7;

        setCurrentWeekIndex((prev) => prev + 1);
        const currentMonthdays = monthDates.get(selectedMonth?.index);
        console.log(
            selectedMonth.index,
            currentMonthdays[currentMonthdays.length - 1],
            weekdays[weekdays.length - 1]
        );

        if (
            currentMonthdays[currentMonthdays.length - 1] ===
            weekdays[weekdays.length - 1]
        ) {
            handleNextMonthNavigation(selectedMonth.index);

            console.log(monthDates, selectedMonth);
            //   return setWeekdays([
            //     ...monthDates.get(selectedMonth?.index)?.slice(skip, week),
            // ]);
        }

        setWeekdays([
            ...monthDates.get(selectedMonth?.index)?.slice(skip, week),
        ]);
    };

    const handlePreviousWeekNavigation = (currentWeekIndex) => {
        const skip = (currentWeekIndex - 3) * 7;
        const week = (currentWeekIndex - 2) * 7;

        setCurrentWeekIndex((prev) => prev - 1);

        // setWeekdays([...dates?.slice(skip, week)]);
        const currentMonthdays = monthDates.get(selectedMonth?.index);
        console.log(selectedMonth.index, currentMonthdays[0], weekdays[0]);

        if (currentMonthdays[0] === weekdays[0]) {
            handlePreviousMonthNavigation(selectedMonth.index);

            //    setWeekdays([
            //     ...monthDates.get(selectedMonth?.index).slice(skip, week),
            // ]);
        }

        setWeekdays([
            ...monthDates.get(selectedMonth?.index).slice(skip, week),
        ]);
    };

    const handleSelectDate = (date) => {
        setSelectedDate(date);
        onChange(`${selectedMonth?.name},${date}`);
    };

    return (
        <div className='re__date__picker__container'>
            <div className='re__date__picker'>
                <div className='re__date__picker__month__selector'>
                    <ReactSVG
                        src={imageLinks.svg.leftArrow}
                        className='re__date__picker__arrow'
                        onClick={() =>
                            handlePreviousMonthNavigation(selectedMonth?.index)
                        }
                    />
                    <span className='re__date__picker__month'>
                        {selectedMonth?.name}
                    </span>
                    <ReactSVG
                        src={imageLinks.svg.leftArrow}
                        className='re__date__picker__arrow --right'
                        onClick={() =>
                            handleNextMonthNavigation(selectedMonth?.index)
                        }
                    />
                </div>
                <div className='re__date__picker__days__container'>
                    <ReactSVG
                        src={imageLinks.svg.leftArrow}
                        className='re__date__picker__arrow --date'
                        onClick={() =>
                            handlePreviousWeekNavigation(currentWeekIndex)
                        }
                    />
                    <div>
                        <div className='week__days'>
                            {days?.map((day, index) => (
                                <span
                                    key={index}
                                    className='week__day --active'>
                                    {day}
                                </span>
                            ))}
                        </div>
                        <div className='week__dates'>
                            {weekdays?.map((date, index) => (
                                <span
                                    className={`week__date ${
                                        selectedDate === date ? "--active" : ""
                                    }`}
                                    key={index}
                                    onClick={() => handleSelectDate(date)}>
                                    {date}
                                </span>
                            ))}
                        </div>
                    </div>
                    <ReactSVG
                        src={imageLinks.svg.leftArrow}
                        className='re__date__picker__arrow --right --date'
                        onClick={() =>
                            handleNextWeekNavigation(currentWeekIndex)
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default ReDatePicker;

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

    const [monthDates, setMonthDates] = useState(new Map());
    const [weekdays, setWeekdays] = useState([]);
    const [currentWeekIndex, setCurrentWeekIndex] = useState(2);
    const [selectedDate, setSelectedDate] = useState("");

    const handleGetDates = () => {
        const year = moment().format("YYYY");
        const month = selectedMonth?.index;

        const daysInMonth = moment(
            `${year}-${month + 1}`,
            "YYYY-MM"
        ).daysInMonth();

        const firstDayOfMonth = moment(`${year}-${month + 1}-01`, "YYYY-MM-DD")
            .startOf("month")
            .startOf("week");

        const dates = [];

        for (let i = 0; i < daysInMonth; i++) {
            const date = moment(firstDayOfMonth).add(i, "day");

            dates.push(date.format("DD"));
        }

        const currentWeekIndex = Math.floor(
            moment().diff(firstDayOfMonth, "days") / 7
        );

        const weekdays = dates.slice(
            currentWeekIndex * 7,
            (currentWeekIndex + 1) * 7
        );

        setMonthDates(monthDates.set(month, dates));
        setWeekdays(weekdays);
        setCurrentWeekIndex(currentWeekIndex);

        const currentDate = moment().format("DD");
        setSelectedDate(currentDate);
        onChange(`${selectedMonth?.name},${currentDate}`);
    };

    const handleGetSubsequentMonthDates = (monthIndex) => {
        const year = moment().format("YYYY");

        const daysInMonth = moment(
            `${year}-${monthIndex + 1}`,
            "YYYY-MM"
        ).daysInMonth();

        const firstDayOfMonth = moment(
            `${year}-${monthIndex + 1}-01`,
            "YYYY-MM-DD"
        )
            .startOf("month")
            .startOf("week");

        const dates = [];

        for (let i = 0; i < daysInMonth; i++) {
            const date = moment(firstDayOfMonth).add(i, "day");

            dates.push(date.format("DD"));
        }

        setMonthDates(monthDates.set(monthIndex, dates));
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

    const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    // months
    const handleNextMonthNavigation = (currentMonthIndex) => {
        const isEndOfMonthList = months.length - 1 === currentMonthIndex;
        const nextMonthIndex = isEndOfMonthList ? 0 : currentMonthIndex + 1;
        setSelectedMonth({
            name: months[isEndOfMonthList ? 0 : currentMonthIndex + 1]?.name,
            index: nextMonthIndex,
        });

        handleGetSubsequentMonthDates(nextMonthIndex);

        setCurrentWeekIndex(2);
        setWeekdays([
            ...monthDates
                .get(selectedMonth?.index === 11 ? 0 : selectedMonth?.index + 1)
                ?.slice(0, 7),
        ]);
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

        setCurrentWeekIndex(3);

        setWeekdays([
            ...monthDates
                .get(selectedMonth?.index === 0 ? 11 : selectedMonth?.index - 1)
                ?.slice(21, 28),
        ]);
    };

    const handleNextWeekNavigation = (currentWeekIndex) => {
        const skip = (currentWeekIndex - 1) * 7;
        const week = currentWeekIndex * 7;

        setCurrentWeekIndex((prev) => prev + 1);
        const currentMonthdays = monthDates.get(selectedMonth?.index);

        if (
            currentMonthdays[currentMonthdays.length - 1] ===
            weekdays[weekdays.length - 1]
        ) {
            return handleNextMonthNavigation(selectedMonth.index);
        }

        setWeekdays([
            ...monthDates.get(selectedMonth?.index)?.slice(skip, week),
        ]);
    };

    const handlePreviousWeekNavigation = (currentWeekIndex) => {
        const skip = (currentWeekIndex - 1) * 7;
        const week = currentWeekIndex * 7;

        setCurrentWeekIndex((prev) => prev - 1);

        const currentMonthdays = monthDates.get(selectedMonth?.index);

        if (currentMonthdays[0] === weekdays[0]) {
            return handlePreviousMonthNavigation(selectedMonth.index);
        }

        setWeekdays([
            ...monthDates.get(selectedMonth?.index).slice(skip, week),
        ]);
    };

    const handleSelectDate = (date) => {
        setSelectedDate(date);
        onChange(`${selectedMonth?.name},${date}`);
    };

    const isBeginingOfANewMonth = weekdays.includes("01");

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
                                    className={`week__date   ${
                                        selectedDate === date ? "--active" : ""
                                    } ${
                                        isBeginingOfANewMonth && date - 1 > 7
                                            ? "--previous__dates"
                                            : ""
                                    }
                                    `}
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

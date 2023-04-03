import React, { useState, useEffect } from "react";
import moment from "moment";
import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";
import { checkArrayEquality } from "utils/helper";
import "./ReDatePicker.scss";

const ReDatePicker = ({ onChange }) => {
    const [selectedMonth, setSelectedMonth] = useState({
        name: moment().format("MMMM"),
        index: moment().format("M") - 1,
    });

    const [monthDates, setMonthDates] = useState(new Map());
    const [weekdays, setWeekdays] = useState([]);
    const [currentWeekIndex, setCurrentWeekIndex] = useState();
    const [selectedDate, setSelectedDate] = useState("");

    const stripOutDate = (date) => {
        return date?.split(",")[0];
    };

    const handleGetDates = () => {
        const year = moment().format("YYYY");
        const month = selectedMonth?.index;

        const firstDayOfMonth = moment(`${year}-${month + 1}-01`, "YYYY-MM-DD")
            .startOf("month")
            .startOf("week");

        const lastDayOfMonth = moment(`${year}-${month + 1}-01}`, "YYYY-MM-DD")
            .endOf("month")
            .endOf("week");

        const dates = [];

        let currentDay = moment(firstDayOfMonth);
        while (currentDay.isSameOrBefore(lastDayOfMonth)) {
            dates.push(currentDay.format("DD,MMM"));
            currentDay.add(1, "day");
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
        setCurrentWeekIndex(currentWeekIndex + 2);

        const currentDate = moment().format("DD,MMM");
        setSelectedDate(currentDate);
        onChange(`${selectedMonth?.name},${stripOutDate(currentDate)}`);
    };

    const handleGetSubsequentMonthDates = (monthIndex) => {
        const year = moment().format("YYYY");

        const firstDayOfMonth = moment(
            `${year}-${monthIndex + 1}-01`,
            "YYYY-MM-DD"
        )
            .startOf("month")
            .startOf("week");

        const lastDayOfMonth = moment(
            `${year}-${monthIndex + 1}-01}`,
            "YYYY-MM-DD"
        )
            .endOf("month")
            .endOf("week");

        const dates = [];

        let currentDay = moment(firstDayOfMonth);
        while (currentDay.isSameOrBefore(lastDayOfMonth)) {
            dates.push(currentDay.format("DD,MMM"));
            currentDay.add(1, "day");
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
    const handleNextMonthNavigation = (currentMonthIndex, isWeekNavigation) => {
        const isEndOfMonthList = months.length - 1 === currentMonthIndex;
        const nextMonthIndex = isEndOfMonthList ? 0 : currentMonthIndex + 1;
        setSelectedMonth({
            name: months[isEndOfMonthList ? 0 : currentMonthIndex + 1]?.name,
            index: nextMonthIndex,
        });

        handleGetSubsequentMonthDates(nextMonthIndex);

        let currentWeekIndex = 2;
        let skip = 0;
        let week = 7;
        if (isWeekNavigation) {
            currentWeekIndex = 3;
            skip = 7;
            week = 14;
        }
        setCurrentWeekIndex(currentWeekIndex);
        setWeekdays([
            ...monthDates
                .get(selectedMonth?.index === 11 ? 0 : selectedMonth?.index + 1)
                ?.slice(skip, week),
        ]);
    };

    const handlePreviousMonthNavigation = (
        currentMonthIndex,
        isWeekNavigation
    ) => {
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

        const currentMonth = monthDates.get(
            selectedMonth?.index === 0 ? 11 : selectedMonth?.index - 1
        );

        let currentWeekIndex = 2;
        let skip = 0;
        let week = 7;

        if (isWeekNavigation) {
            currentWeekIndex = 5;
            skip = currentMonth?.length - 14;
            week = currentMonth?.length - 7;
        }

        setCurrentWeekIndex(currentWeekIndex);

        setWeekdays([...currentMonth?.slice(skip, week)]);
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
            return handleNextMonthNavigation(selectedMonth.index, true);
        }

        setWeekdays([
            ...monthDates.get(selectedMonth?.index)?.slice(skip, week),
        ]);
    };

    const handlePreviousWeekNavigation = (currentWeekIndex) => {
        const skip = (currentWeekIndex - 3) * 7;
        const week = (currentWeekIndex - 2) * 7;

        setCurrentWeekIndex((prev) => prev - 1);

        const currentMonthdays = monthDates.get(selectedMonth?.index);

        if (currentMonthdays[0] === weekdays[0]) {
            return handlePreviousMonthNavigation(selectedMonth.index, true);
        }

        setWeekdays([
            ...monthDates.get(selectedMonth?.index).slice(skip, week),
        ]);
    };

    const currentMonth = monthDates.get(selectedMonth?.index);

    const isFirstWeekOfMonth = checkArrayEquality(
        weekdays,
        currentMonth?.slice(0, 7)
    );
    const isLastWeekOfMonth = checkArrayEquality(
        weekdays,
        currentMonth?.slice(currentMonth?.length - 7, currentMonth?.length)
    );

    const handleSelectDate = (date) => {
        setSelectedDate(date);

        const strippedDate = stripOutDate(date);
        let monthValue = selectedMonth?.index;

        if (isFirstWeekOfMonth && strippedDate > 7) {
            monthValue =
                selectedMonth?.index === 11 ? 0 : selectedMonth?.index - 1;
        }

        if (isLastWeekOfMonth && strippedDate < 7) {
            monthValue =
                selectedMonth?.index === 11 ? 0 : selectedMonth?.index + 1;
        }

        onChange(`${months[monthValue]?.name},${strippedDate}`);
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
                                    className={`week__date   ${
                                        selectedDate === date ? "--active" : ""
                                    } ${
                                        isFirstWeekOfMonth &&
                                        stripOutDate(date) > 7
                                            ? "--gray__out__dates"
                                            : ""
                                    }
                                    ${
                                        isLastWeekOfMonth &&
                                        stripOutDate(date) < 7
                                            ? "--gray__out__dates"
                                            : ""
                                    }
                                    `}
                                    key={index}
                                    onClick={() => handleSelectDate(date)}>
                                    {stripOutDate(date)}
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

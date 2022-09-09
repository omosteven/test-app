import React, { useState, useEffect } from "react";
import moment from "moment";

const Countdown = ({ countdownTo, countdownEnded, setCountdownEnded }) => {
    const [hours, setHours] = useState(0);
    const [mins, setMins] = useState(0);

    const then = moment(moment(countdownTo).format("h:mm a"), "h:mm a");

    const now = moment();
    const diff = moment(
        new Date(then.toISOString()).getTime() -
            new Date(now.toISOString()).getTime()
    );

    let duration = moment.duration(Number(diff), "milliseconds");
    const countdown = () => {
        duration = moment.duration(Number(duration) - 1000, "milliseconds");
        if (duration.minutes() <= 0) {
            setCountdownEnded(true);
            return setMins(0);
        }

        setHours(`${duration.hours()}`);
        setMins(`${duration.minutes()}`);
    };

    useEffect(() => {
        let countdownId = setInterval(() => countdown(), 1000);
        setCountdownEnded(false);
        return () => clearInterval(countdownId);

        // eslint-disable-next-line
    }, [countdownTo, countdownEnded]);

    return (
        <span className='timer'>
            {hours?.length > 1 ? hours : `0${hours}`}:
            {mins?.length > 1 ? mins : `0${mins}`}
        </span>
    );
};

export default Countdown;

import React, { useState, useEffect } from "react";
import moment from "moment";

const Countdown = ({ countdownTo, countdownEnded, setCountdownEnded }) => {
    const [hours, setHours] = useState(0);
    const [mins, setMins] = useState(0);
    const [showCountDown, setShowCountDown] = useState(false);

    const then = moment(moment(countdownTo).format("h:mm a"), "h:mm a");

    const now = moment();
    const diff = moment(
        new Date(then.toISOString()).getTime() -
            new Date(now.toISOString()).getTime()
    );

    let duration = moment.duration(Number(diff), "milliseconds");

    const countdown = () => {
        duration = moment.duration(Number(duration) - 1000, "milliseconds");

        if (
            duration.hours() === 0 &&
            duration.minutes() <= 0 &&
            duration.seconds() <= 0
        ) {
            setCountdownEnded(true);
            return setMins(0);
        }

        setHours(duration?.hours());
        setMins(duration?.minutes());
        setShowCountDown(true);
    };

    useEffect(() => {
        let countdownId = setInterval(() => countdown(), 1000);
        setCountdownEnded?.(false);
        return () => clearInterval(countdownId);

        // eslint-disable-next-line
    }, [countdownTo, countdownEnded]);

    return (
        <span className='timer'>
            {showCountDown ? (
                <>
                    {" "}
                    {hours > 0
                        ? `${hours > 9 ? hours : `0${hours}`}h:${
                              mins > 9 ? mins : `0${mins}`
                          }m`
                        : mins > 9
                        ? `${mins + 1}:00m`
                        : `0${mins + 1}:00m`}
                </>
            ) : (
                `00:00m`
            )}
        </span>
    );
};

export default Countdown;

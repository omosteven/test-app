import React from "react";
import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";
import Countdown from "./Countdown/Countdown";
import { convertSecondsToISOString } from "utils/helper";
import "./CountdownTimer.scss";

const CountdownTimer = ({ countdownTo, setCountdownEnded, countdownEnded }) => {
    return (
        <div className='countdown__timer'>
            <ReactSVG
                src={imageLinks?.svg?.clock}
                className='countdown__clock'
            />
            <Countdown
                countdownTo={convertSecondsToISOString(countdownTo)}
                setCountdownEnded={setCountdownEnded}
                countdownEnded={countdownEnded}
            />
        </div>
    );
};

export default CountdownTimer;

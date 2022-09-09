import React, { useState } from "react";
import imageLinks from "assets/images";
import { ReactSVG } from "react-svg";
import Countdown from "./Countdown/Countdown";
import { convertSecondsToISOString } from "utils/helper";
import "./ScheduledBranchOption.scss";

const ScheduledBranchOption = ({
    data,
    branchOptionId,
    selectedOption,
    handleMessageOptionSelect,
    messageIndex,
    messagesDepth,
    deliveryDate,
}) => {
    const [countdownEnded, setCountdownEnded] = useState(false);
    const { branchOptionLabel, scheduleDuration } = data;
    const shouldBeDisabled = messageIndex < messagesDepth;
    const isSelected = selectedOption === branchOptionId;
    const countdownTo =
        new Date(deliveryDate).getTime() / 1000 + parseInt(scheduleDuration);
    const startCountdown = Date.now() / 1000 > countdownTo;
    const disable = countdownEnded ? countdownEnded : startCountdown;

    return (
        <div>
            <div
                className={`scheduled__branch__option ${
                    disable ? "active" : "inactive"
                } ${
                    selectedOption
                        ? isSelected
                            ? "selected"
                            : "__fade_out"
                        : ""
                }`}
                onClick={() =>
                    selectedOption ? null : handleMessageOptionSelect()
                }
                disabled={disable ? disable : shouldBeDisabled}>
                {branchOptionLabel}
            </div>
            {!disable && (
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
            )}
        </div>
    );
};

export default ScheduledBranchOption;

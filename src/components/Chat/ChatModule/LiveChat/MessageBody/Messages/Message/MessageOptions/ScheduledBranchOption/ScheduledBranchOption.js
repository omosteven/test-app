import React, { useState } from "react";
import { useSelector } from "react-redux";
import { INPUT_NEEDED } from "../../../enums";
import CountdownTimer from "./CountdownTimer/CountdownTimer";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import "./ScheduledBranchOption.scss";

const { WORK_MODE, RELAXED } = defaultTemplates;

const ScheduledBranchOption = ({
    data,
    branchOptionId,
    selectedOption,
    handleMessageOptionSelect,
    messageIndex,
    messagesDepth,
    deliveryDate,
    lastMessage,
}) => {
    const { defaultTemplate } = useSelector(
        (state) => state?.chat?.chatSettings
    );
    const { messageActionType } = lastMessage || {};

    const [countdownEnded, setCountdownEnded] = useState(false);
    const { branchOptionLabel, scheduleDuration } = data;
    const shouldBeDisabled =
        messageActionType === INPUT_NEEDED
            ? false
            : messageIndex < messagesDepth;
    const isSelected = selectedOption === branchOptionId;
    const countdownTo =
        new Date(deliveryDate).getTime() / 1000 +
        parseInt(scheduleDuration || 0);
    const startCountdown = Date.now() / 1000 > countdownTo;
    const enable = countdownEnded ? countdownEnded : startCountdown;

    return (
        <div>
            <div
                className={`scheduled__branch__option ${
                    enable && !shouldBeDisabled ? "active" : "inactive"
                } ${
                    selectedOption
                        ? isSelected
                            ? "selected"
                            : "__fade_out"
                        : ""
                }`}
                onClick={() =>
                    selectedOption ? null : handleMessageOptionSelect()
                }>
                {branchOptionLabel}
                {!enable && defaultTemplate === RELAXED && (
                    <div className='option__pause'>
                        <span>This option is paused for</span>{" "}
                        <CountdownTimer
                            countdownTo={countdownTo}
                            setCountdownEnded={setCountdownEnded}
                            countdownEnded={countdownEnded}
                        />
                    </div>
                )}
            </div>
            {!enable && defaultTemplate === WORK_MODE && (
                <CountdownTimer
                    countdownTo={countdownTo}
                    setCountdownEnded={setCountdownEnded}
                    countdownEnded={countdownEnded}
                />
            )}
        </div>
    );
};

export default ScheduledBranchOption;

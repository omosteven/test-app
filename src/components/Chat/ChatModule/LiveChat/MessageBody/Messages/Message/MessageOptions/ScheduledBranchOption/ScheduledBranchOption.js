import React, { useState } from "react";
import { useSelector } from "react-redux";
import { INPUT_NEEDED } from "../../../enums";
import CountdownTimer from "./CountdownTimer/CountdownTimer";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import SmallLoader from "components/ui/SmallLoader/SmallLoader";
import "./ScheduledBranchOption.scss";

const { WORKMODE, RELAXED } = defaultTemplates;

const ScheduledBranchOption = ({
    data,
    branchOptionId,
    selectedOption,
    handleMessageOptionSelect,
    messageIndex,
    messagesDepth,
    deliveryDate,
    lastMessage,
    mssgOptionLoading,
}) => {
    const { defaultTemplate } = useSelector(
        (state) => state?.chat?.chatSettings
    );
    const isRelaxedTemplate = defaultTemplate === RELAXED;
    const isWorkModeTemplate = defaultTemplate === WORKMODE;

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
                <span
                    className={
                        mssgOptionLoading && isSelected
                            ? "branch__option--hide-on-mobile"
                            : ""
                    }>
                    {branchOptionLabel}
                </span>

                {!enable && isRelaxedTemplate && (
                    <div className='option__pause'>
                        <span>This option is paused for</span>{" "}
                        <CountdownTimer
                            countdownTo={countdownTo}
                            setCountdownEnded={setCountdownEnded}
                            countdownEnded={countdownEnded}
                        />
                    </div>
                )}
                {mssgOptionLoading && isSelected && (
                    <SmallLoader otherClassName='branch__option--loader' />
                )}
            </div>
            {!enable && isWorkModeTemplate && (
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

import React from "react";
import ReDatePicker from "components/ui/InputTypes/DatePicker/ReDatePicker/ReDatePicker";
import DatePickerField from "./DatePickerField/DatePickerField";
import { datePickerStages } from "./enum";

const { DATE_VALUE, PICK_DATE } = datePickerStages;

const DatePickerWrapper = ({
    stage,
    request,
    updateRequest,
    setDatePickerStage,
}) => {
    const handleDatePickerStage = (stage) => {
        setDatePickerStage(stage);
    };

    const renderBasedOnStage = () => {
        switch (stage) {
            case DATE_VALUE:
                return (
                    <DatePickerField
                        request={request}
                        onClick={handleDatePickerStage}
                    />
                );
            case PICK_DATE:
                return (
                    <ReDatePicker
                        onChange={(date) => {
                            updateRequest((prev) => ({
                                ...prev,
                                message: date,
                            }));
                        }}
                    />
                );
            default:
                return "";
        }
    };
    return <>{renderBasedOnStage()}</>;
};

export default DatePickerWrapper;

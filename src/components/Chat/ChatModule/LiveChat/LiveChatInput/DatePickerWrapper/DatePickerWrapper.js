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
    disabled,
    loading,
    hasBtnActions,
    onSubmit,
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
                        disabled={disabled}
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
                        onCancel={() => setDatePickerStage(DATE_VALUE)}
                        {...{ onSubmit, loading, hasBtnActions }}
                    />
                );
            default:
                return "";
        }
    };
    return <>{renderBasedOnStage()}</>;
};

export default DatePickerWrapper;

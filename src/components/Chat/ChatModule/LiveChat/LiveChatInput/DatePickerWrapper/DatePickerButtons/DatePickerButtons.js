import { Button } from "components/ui";
import "./DatePickerButtons.scss";

const DatePickerButtons = ({ onCancel, onSubmit, loading }) => {
    return (
        <div className='date-picker-buttons'>
            <Button
                text={"Cancel"}
                otherClass='date-picker-buttons__cancel my-3 w-100'
                onClick={onCancel}
            />

            <Button
                type='submit'
                text={"Submit"}
                otherClass='date-picker-buttons__submit my-3 w-100'
                onClick={onSubmit}
                loading={loading}
                loaderClassName='date-picker-buttons__submit_loader'
            />
        </div>
    );
};

export default DatePickerButtons;

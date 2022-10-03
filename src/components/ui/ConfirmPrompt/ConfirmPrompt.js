import { Button } from "../Button/Button";
import "./ConfirmPrompt.scss";

export const ConfirmPrompt = ({
    handleCancel,
    title,
    subTitle,
    handleConfirmation,
    loading,
}) => {
    return (
        <div className='confirm__action'>
            {title && <h1>{title}</h1>}
            <p>{subTitle}</p>
            <div id='btnActionGroup'>
                <Button
                    type='button'
                    text={`Continue`}
                    classType='primary'
                    onClick={handleConfirmation}
                    loading={loading}
                />
                <Button
                    type='button'
                    text='Close'
                    classType='bordered'
                    // otherClass="my-2 w-100"
                    onClick={handleCancel}
                    disabled={loading}
                />
            </div>
        </div>
    );
};

export default ConfirmPrompt;

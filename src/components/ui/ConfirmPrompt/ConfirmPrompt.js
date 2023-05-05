import { Button } from "../Button/Button";
import "./ConfirmPrompt.scss";

export const ConfirmPrompt = ({
    handleCancel,
    title,
    subTitle,
    handleConfirmation,
    loading,
    isRelaxedTemplate,
    isDarkModeTheme,
    yesBtnText,
    noBtnText,
}) => {
    return (
        <div
            className={`confirm__action ${
                isRelaxedTemplate ? "relaxed__template__confirm__action" : ""
            }`}>
            {title && (
                <h1
                    className={`confirm__action__title ${
                        isRelaxedTemplate
                            ? "relaxed__template__action__title"
                            : ""
                    } ${isDarkModeTheme ? "dark__mode__action__title" : ""}`}>
                    {title}
                </h1>
            )}
            <p
                className={`confirm__action__sub__title ${
                    isRelaxedTemplate
                        ? "relaxed__template__action__sub__title"
                        : ""
                } ${isDarkModeTheme ? "dark__mode__action__sub__title" : ""}`}>
                {subTitle}
            </p>
            <div
                className={`btn__action__group ${
                    isRelaxedTemplate
                        ? "relaxed__template__btn__action__group"
                        : ""
                } ${isDarkModeTheme ? "dark__mode__btn__action__group" : ""}`}>
                <Button
                    type='button'
                    text={yesBtnText || "Continue"}
                    classType='primary'
                    onClick={handleConfirmation}
                    loading={loading}
                />
                <Button
                    type='button'
                    text={noBtnText || "Close"}
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

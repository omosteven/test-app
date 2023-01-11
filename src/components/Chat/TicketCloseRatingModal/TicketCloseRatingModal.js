import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, ErrorDialog } from "components/ui";
import CustomRatings from "components/ui/CustomRatings/CustomRatings";
import API from "lib/api";
import apiRoutes from "lib/api/apiRoutes";
import { getErrorMessage } from "utils/helper";
import { defaultTemplates, defaultThemes } from "hoc/AppTemplateWrapper/enum";
import PopupModal from "components/common/Modal/PopupModal/PopupModal";
import "./TicketCloseRatingModal.scss";

const { DARK_MODE_DEFAULT } = defaultThemes;
const { RELAXED } = defaultTemplates;

const TicketCloseRatingModal = ({
    show,
    toggle,
    referenceData,
    handleSuccess,
}) => {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [ratingValue, setRatingValue] = useState(0);
    const { defaultTemplate, defaultTheme } = useSelector(
        (state) => state?.chat?.chatSettings
    );

    const rateTicket = async () => {
        try {
            const { ticketId } = referenceData;
            setErrorMsg("");
            setLoading(true);

            const url = apiRoutes?.rateTicket(ticketId);
            const res = await API.put(url, {
                rating: ratingValue / 20,
            });
            if (res.status === 200) {
                handleSuccess();
            }
        } catch (err) {
            setErrorMsg(getErrorMessage(err));
            setLoading(false);
        }
    };

    const isRelaxedTemplate = defaultTemplate === RELAXED;
    const isDarkModeTheme = defaultTheme === DARK_MODE_DEFAULT;

    return (
        <PopupModal
            show={show}
            toggle={toggle}
            isRelaxedTemplate={isRelaxedTemplate}
            isDarkModeTheme={isDarkModeTheme}>
            <div
                className={`ticket-closure-modal  ${
                    isRelaxedTemplate
                        ? "relaxed__template__ticket-closure-modal"
                        : ""
                }`}>
                <ErrorDialog
                    show={Boolean(errorMsg)}
                    message={errorMsg}
                    hide={() => setErrorMsg()}
                />
                <div className="ticket-closure-modal__rating__wrapper">
                    <p
                        className={`ticket-closure-modal__text  ${
                            isRelaxedTemplate
                                ? "relaxed__template__modal__text"
                                : ""
                        } ${isDarkModeTheme ? "dark__mode__modal__text" : ""}`}>
                        Kindly give a few minutes of your time to rate your
                        experience. Thank you.
                    </p>
                    <div className='ticket-closure-modal__rating'>
                        <CustomRatings
                            rating={ratingValue}
                            handleRating={(value) => setRatingValue(value)}
                            otherClass={`${
                                isRelaxedTemplate
                                    ? "relaxed__template__ratings"
                                    : ""
                            }`}
                        />
                    </div>
                </div>
                <div
                    className={`btn__action__group ${
                        isRelaxedTemplate
                            ? "relaxed__template__btn__action__group"
                            : ""
                    } ${
                        isDarkModeTheme ? "dark__mode__btn__action__group" : ""
                    }`}>
                    <Button
                        type='button'
                        text={` ${isRelaxedTemplate ? "Rate" : "Continue"}`}
                        classType='primary'
                        onClick={rateTicket}
                        loading={loading}
                    />
                    <Button
                        type='button'
                        text={` ${isRelaxedTemplate ? "Skip" : "Close"}`}
                        classType='bordered'
                        onClick={toggle}
                        disabled={loading}
                    />
                </div>
            </div>
        </PopupModal>
    );
};

export default TicketCloseRatingModal;

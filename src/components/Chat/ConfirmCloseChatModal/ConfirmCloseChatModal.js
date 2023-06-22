import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import API from "../../../lib/api";
import apiRoutes from "../../../lib/api/apiRoutes";
import { getErrorMessage } from "../../../utils/helper";
import { ErrorDialog } from "../../ui";
import ConfirmPrompt from "../../ui/ConfirmPrompt/ConfirmPrompt";
import { defaultTemplates, defaultThemes } from "hoc/AppTemplateWrapper/enum";
import PopupModal from "components/common/Modal/PopupModal/PopupModal";
import { setUserInActive } from "store/auth/actions";

const { DARK_MODE_DEFAULT } = defaultThemes;
const { RELAXED } = defaultTemplates;

const ConfirmCloseChatModal = ({
    show,
    toggle,
    handleSuccess,
    referenceData,
}) => {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const { defaultTemplate, defaultTheme } = useSelector(
        (state) => state?.chat?.chatSettings
    );

    const dispatch = useDispatch();

    const [hasTimedOut, setHasTimedOut] = useState(false);

    const closeTicket = async () => {
        try {
            setHasTimedOut(false);
            const { ticketId } = referenceData;
            setErrorMsg("");
            setLoading(true);

            const url = apiRoutes?.closeTicket(ticketId);
            const res = await API.post(
                url,
                {},
                {
                    timeout: 30000,
                }
            );
            if (res.status === 201) {
                handleSuccess();
                dispatch(setUserInActive(true));
            }
        } catch (err) {
            setLoading(false);
            if (err?.message === "timeout of 30000ms exceeded") {
                setHasTimedOut(true);
                setErrorMsg("It looks like this took longer time.");
                return;
            }
            setErrorMsg(getErrorMessage(err));
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
            <div>
                <ErrorDialog
                    show={Boolean(errorMsg)}
                    message={errorMsg}
                    hide={() => setErrorMsg()}
                />
                <ConfirmPrompt
                    handleCancel={toggle}
                    handleConfirmation={closeTicket}
                    subTitle={`Are you sure you want to close this chat? If you do, your ticket would be marked as closed.`}
                    loading={loading}
                    isRelaxedTemplate={isRelaxedTemplate}
                    isDarkModeTheme={isDarkModeTheme}
                    yesBtnText={hasTimedOut && "Retry"}
                />
            </div>
        </PopupModal>
    );
};

export default ConfirmCloseChatModal;

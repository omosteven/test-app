import React from "react";
import { useSelector } from "react-redux";
import PopupModal from "components/common/Modal/PopupModal/PopupModal";
import ConfirmPrompt from "components/ui/ConfirmPrompt/ConfirmPrompt";
import { setUserExitIntent } from "storage/sessionStorage";
import { defaultTemplates, defaultThemes } from "hoc/AppTemplateWrapper/enum";

const { DARK_MODE_DEFAULT } = defaultThemes;
const { RELAXED } = defaultTemplates;

const TabCloseConfirmModal = ({ showModal, toggleModal, resetState }) => {
    const { defaultTemplate, defaultTheme } = useSelector(
        (state) => state?.chat?.chatSettings
    );

    const handleCloseModal = () => {
        toggleModal(false);
        resetState();
    };

    const handleClose = () => {
        toggleModal(false);
        setUserExitIntent(true);
    };

    const isRelaxedTemplate = defaultTemplate === RELAXED;
    const isDarkModeTheme = defaultTheme === DARK_MODE_DEFAULT;

    return (
        <PopupModal
            show={showModal}
            toggle={handleCloseModal}
            isRelaxedTemplate={isRelaxedTemplate}
            isDarkModeTheme={isDarkModeTheme}>
            <ConfirmPrompt
                handleCancel={handleCloseModal}
                handleConfirmation={handleClose}
                subTitle={`Are you sure you want to close this tab? If you do, your ticket would be marked as closed.`}
                loading={false}
                isRelaxedTemplate={isRelaxedTemplate}
                isDarkModeTheme={isDarkModeTheme}
            />
        </PopupModal>
    );
};

export default TabCloseConfirmModal;

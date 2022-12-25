import React from "react";
import Modal from "../Modal";
import "./PopupModal.scss";

const PopupModal = ({
    show,
    toggle,
    isRelaxedTemplate,
    isDarkModeTheme,
    children,
}) => {
    return (
        <Modal
            {...{
                show,
                toggle,
            }}
            contentClassName={`popup__modal__content ${
                isRelaxedTemplate ? "relaxed__template__modal__content" : ""
            } ${isDarkModeTheme ? "dark__mode__modal__content" : ""}`}
            backdropClassName={`${
                isDarkModeTheme ? "dark__mode__modal__backdrop" : ""
            }`}>
            {children}
        </Modal>
    );
};

export default PopupModal;

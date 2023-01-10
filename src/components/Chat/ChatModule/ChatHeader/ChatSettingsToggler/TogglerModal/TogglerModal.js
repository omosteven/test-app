import React from "react";
import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";
import Modal from "components/common/Modal/Modal";
import "./TogglerModal.scss";

const TogglerModal = ({
    showModal,
    toggleModal,
    handleChangeTheme,
    handleCloseTicket,
    isDarkModeTheme,
}) => {
    return (
        <Modal
            show={showModal}
            toggle={toggleModal}
            className='modal-dialog-top'
            contentClassName={`settings__toggle__modal__content ${
                isDarkModeTheme ? "dark__mode__settings__toggle" : ""
            }`}
            backdropClassName={`${
                isDarkModeTheme ? "dark__mode__modal__backdrop" : ""
            }`}>
            <div className='settings__toggle__header'>
                <span>View Options</span>{" "}
                <ReactSVG
                    src={imageLinks.svg.cancelX}
                    onClick={toggleModal}
                    className='toggle__settings__modal'
                />
            </div>
            <ul className='settings__items'>
                <li
                    className={`settings__item ${
                        isDarkModeTheme ? "dark__mode__settings__item" : ""
                    }`}
                    onClick={handleChangeTheme}>
                    <span>{isDarkModeTheme ? "Light Mode" : "Dark Mode"}</span>
                    <ReactSVG
                        src={imageLinks.svg.themeSun}
                        className='settings__item__sun__icon'
                    />
                </li>
                <li
                    className={`settings__item ${
                        isDarkModeTheme ? "dark__mode__settings__item" : ""
                    }`}
                    onClick={() => {
                        handleCloseTicket();
                        toggleModal();
                    }}>
                    <span>Close Chat</span>
                    <ReactSVG
                        src={imageLinks.svg.cancelX}
                        className='settings__item__cancel__icon'
                    />
                </li>
            </ul>
        </Modal>
    );
};

export default TogglerModal;

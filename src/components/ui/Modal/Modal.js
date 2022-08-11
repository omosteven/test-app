import React from "react";
import { Modal as ReactstrapModal, ModalHeader, ModalBody } from "reactstrap";
import "./Modal.scss";

export const Modal = ({
    show,
    close,
    size,
    toggle,
    fullscreen = false,
    children,
}) => (
    <ReactstrapModal
        isOpen={show}
        size={size}
        fade={true}
        toggle={toggle}
        zIndex={""}
        onClosed={close}
        fullscreen={fullscreen}
        scrollable={false}>
        <ModalHeader toggle={close} />
        <ModalBody>{children}</ModalBody>
    </ReactstrapModal>
);
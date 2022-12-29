import React from "react";
import { Modal as BootstrapModal, ModalHeader, ModalBody } from "reactstrap";

const Modal = ({
    show,
    toggle,
    title,
    children,
    className = "modal-dialog-centered",
    contentClassName,
    backdropClassName,
}) => {
    return (
        <>
            <BootstrapModal
                fade={false}
                className={className}
                isOpen={show}
                toggle={toggle}
                contentClassName={contentClassName}
                backdropClassName={backdropClassName}>
                {title && <ModalHeader toggle={toggle}>{title}</ModalHeader>}
                <ModalBody>{children}</ModalBody>
            </BootstrapModal>
        </>
    );
};

export default Modal;

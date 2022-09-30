import React from "react";
import { Modal as BootstrapModal, ModalHeader, ModalBody } from "reactstrap";

const Modal = ({ show, toggle, title, children, otherClassNames }) => {
    return (
        <>
            <BootstrapModal
                fade={false}
                className={`modal-dialog-centered ${
                    otherClassNames ? otherClassNames : ""
                }`}
                isOpen={show}
                toggle={toggle}>
                {title && <ModalHeader toggle={toggle}>{title}</ModalHeader>}
                <ModalBody>{children}</ModalBody>
            </BootstrapModal>
        </>
    );
};

export default Modal;

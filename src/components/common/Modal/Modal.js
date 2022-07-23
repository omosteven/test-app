import React from 'react';
import { Modal as BootstrapModal, ModalHeader, ModalBody } from 'reactstrap';

const Modal = ({ show, toggle, title, children }) => {
    return (
        <>
            <BootstrapModal fade={false} className='modal-dialog-centered' isOpen={show} toggle={toggle}>
                {title && <ModalHeader toggle={toggle}>{title}</ModalHeader>}
                <ModalBody>{children}</ModalBody>
            </BootstrapModal>
        </>
    );
};

export default Modal;


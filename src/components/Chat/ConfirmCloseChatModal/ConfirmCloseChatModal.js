import React, { useState } from 'react';
import API from '../../../lib/api';
import apiRoutes from '../../../lib/api/apiRoutes';
import { getErrorMessage } from '../../../utils/helper';
import Modal from '../../common/Modal/Modal';
import { ErrorDialog } from '../../ui';
import ConfirmPrompt from '../../ui/ConfirmPrompt/ConfirmPrompt';

const ConfirmCloseChatModal = ({ show, toggle, handleSuccess, referenceData }) => {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const closeTicket = async () => {
        try {
            const { ticketId } = referenceData;
            setErrorMsg("");
            setLoading(true);

            const url = apiRoutes?.closeTicket(ticketId);
            const res = await API.post(url);
            if (res.status === 201) {
                handleSuccess()
            }

        } catch (err) {
            setErrorMsg(getErrorMessage(err));
            setLoading(false);
        }
    }
    return (
        <Modal {
            ...{
                show,
                toggle
            }
        }>
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
                />
            </div>
        </Modal>
    );
};

export default ConfirmCloseChatModal;
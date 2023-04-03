import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import imageLinks from "assets/images";
import { ToastContext } from "components/common/Toast/context/ToastContextProvider";
import { Button } from "components/ui";
import { useContext } from "react";
import { ReactSVG } from "react-svg";
import ToastCustomerVerifySuccess from "./ToastCustomerVerifySuccess/ToastCustomerVerifySuccess";
import {
    deleteTicketsMessages,
    saveTicketsMessages,
} from "store/tickets/actions";
import { ADD_EMAIL_ADDRESS } from "../../MessageBody/Messages/enums";
import {
    messageTypes,
    appMessageUserTypes,
} from "../../MessageBody/Messages/enums";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";

const { SUCCESS } = messageTypes;
const { WORKMODE } = defaultTemplates;
const { WORKSPACE_AGENT } = appMessageUserTypes;

const CustomerVerifySuccess = ({ closeModal, messages, redirectUser }) => {
    const { defaultTemplate, workspaceSlug } = useSelector(
        (state) => state?.chat?.chatSettings
    );
    const toastMessage = useContext(ToastContext);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleContinue = async () => {
        const { messageId, ticketId } =
            messages?.find(
                (ticketMessage) =>
                    ticketMessage?.messageActionType === ADD_EMAIL_ADDRESS
            ) || {};

        dispatch(
            deleteTicketsMessages({
                messageId,
                ticketId,
            })
        );

        if (defaultTemplate === WORKMODE) {
            toastMessage(<ToastCustomerVerifySuccess />);
        } else {
            dispatch(
                saveTicketsMessages({
                    ticketId,
                    messageId,
                    messageContent:
                        "We have successfully verified your account and your ticket has been saved.",
                    messageHeader: "Email verification successful",
                    messageType: SUCCESS,
                    senderType: WORKSPACE_AGENT,
                })
            );
        }

        if (redirectUser) {
            history.push(`/chat?workspaceSlug=${workspaceSlug}`);
        } else {
            closeModal();
        }
    };

    return (
        <>
            <div>
                <h5 className='signin-header'>Verification successful.</h5>
                <p className='signin-sub__text'>
                    We have successfully verified your account and your ticket
                    has been saved.
                </p>
                <div className='info__section'>
                    <ReactSVG src={imageLinks.svg.info} />
                    <p>
                        This email address would be used to communicate updates
                        with you.
                    </p>
                </div>
                <Button
                    type='submit'
                    text={"Continue"}
                    classType='primary'
                    otherClass='my-3 w-100'
                    onClick={handleContinue}
                />
            </div>
        </>
    );
};

export default CustomerVerifySuccess;

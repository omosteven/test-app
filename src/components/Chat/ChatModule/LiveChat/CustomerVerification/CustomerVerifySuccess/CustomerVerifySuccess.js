import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import imageLinks from "assets/images";
import { ToastContext } from "components/common/Toast/context/ToastContextProvider";
import { Button } from "components/ui";
import { useContext } from "react";
import { ReactSVG } from "react-svg";
import ToastCustomerVerifySuccess from "./ToastCustomerVerifySuccess/ToastCustomerVerifySuccess";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import { generateID } from "utils/helper";
import {
    deleteTicketsMessages,
    saveTicketsMessages,
} from "store/tickets/actions";
import { ADD_EMAIL_ADDRESS } from "../../MessageBody/Messages/enums";
import {
    messageTypes,
    appMessageUserTypes,
} from "../../MessageBody/Messages/enums";
import "./CustomerVerifySuccess.scss";
import { isLiveApp } from "config/config";

const { WORKMODE } = defaultTemplates;
const { SUCCESS } = messageTypes;
const { WORKSPACE_AGENT } = appMessageUserTypes;

const CustomerVerifySuccess = ({
    closeModal,
    redirectUser,
    messages,
    ticketId,
}) => {
    const { defaultTemplate, workspaceSlug } = useSelector(
        (state) => state?.chat?.chatSettings
    );

    const isWorkModeTemplate = defaultTemplate === WORKMODE;
    const toastMessage = useContext(ToastContext);

    const history = useHistory();
    const dispatch = useDispatch();

    const handleEmailVerificationSuccess = () => {
        const { messageId } =
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

        if (!isWorkModeTemplate) {
            dispatch(
                saveTicketsMessages({
                    ticketId,
                    messageId: generateID(),
                    messageContent:
                        "We have successfully verified your account and your ticket has been saved.",
                    messageHeader: "Email verification successful",
                    messageType: SUCCESS,
                    senderType: WORKSPACE_AGENT,
                    deliveryDate: new Date().toISOString(),
                })
            );
        }
    };

    useEffect(() => {
        handleEmailVerificationSuccess();
        // eslint-disable-next-line
    }, []);

    const handleContinue = async () => {
        if (isWorkModeTemplate) {
            toastMessage(<ToastCustomerVerifySuccess />);
        }

        if (redirectUser) {
            const url = isLiveApp ? '/chat' : `/chat?workspaceSlug=${workspaceSlug}`;
            history.push(url);
        } else {
            closeModal();
        }
    };

    return (
        <div>
            <div className='verification__success__continer'>
                <ReactSVG
                    src={imageLinks.svg.successCheck}
                    className='verification__success__icon'
                />
                <h5 className='verification__success__title'>
                    Email successfully added
                </h5>
                <p className='verification__success__subtitle'>
                    We have successfully verified your account and your ticket
                    has been saved.
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
    );
};

export default CustomerVerifySuccess;

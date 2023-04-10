import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import imageLinks from "assets/images";
import { ToastContext } from "components/common/Toast/context/ToastContextProvider";
import { Button } from "components/ui";
import { useContext } from "react";
import { ReactSVG } from "react-svg";
import ToastCustomerVerifySuccess from "./ToastCustomerVerifySuccess/ToastCustomerVerifySuccess";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import "./CustomerVerifySuccess.scss";

const { WORKMODE } = defaultTemplates;

const CustomerVerifySuccess = ({ closeModal, redirectUser }) => {
    const { defaultTemplate, workspaceSlug } = useSelector(
        (state) => state?.chat?.chatSettings
    );

    const isWorkModeTemplate = defaultTemplate === WORKMODE;
    const toastMessage = useContext(ToastContext);

    const history = useHistory();

    const handleContinue = async () => {
        if (isWorkModeTemplate) {
            toastMessage(<ToastCustomerVerifySuccess />);
        }

        if (redirectUser) {
            history.push(`/chat?workspaceSlug=${workspaceSlug}`);
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

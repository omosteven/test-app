import React from "react";
import { useSelector } from "react-redux";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import PoweredBy from "components/common/PoweredBy/PoweredBy";
import "./ActionAddEmail.scss";

const { RELAXED } = defaultTemplates;

const ActionAddEmail = ({ handleVerifyAction }) => {
    const { defaultTemplate } = useSelector(
        (state) => state?.chat?.chatSettings
    );

    const isRelaxedTemplate = defaultTemplate === RELAXED;

    return (
        <div className='action__add__email'>
            <div
                className='add__email branch__option'
                onClick={handleVerifyAction}>
                Add email address
            </div>
            {isRelaxedTemplate && (
                <PoweredBy otherClassName='white__background' />
            )}
        </div>
    );
};

export default ActionAddEmail;

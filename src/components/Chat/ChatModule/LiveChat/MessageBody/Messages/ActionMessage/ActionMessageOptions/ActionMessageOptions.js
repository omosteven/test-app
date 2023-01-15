import React from "react";
import { useSelector } from "react-redux";
import ActionMessageOption from "./ActionMessageOption/ActionMessageOption";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import PoweredBy from "components/common/PoweredBy/PoweredBy";
import "./ActionMessageOptions.scss";

const { RELAXED } = defaultTemplates;

const ActionMessageOptions = ({
    actionBranchOptions,
    handleMessageOptionSelect,
    selectedOption,
    messageIndex,
    messagesDepth,
    deliveryDate,
    messageActionBranchId,
}) => {
    const { defaultTemplate } = useSelector(
        (state) => state?.chat?.chatSettings
    );

    const isRelaxedTemplate = defaultTemplate === RELAXED;

    return (
        <div className='action-message-options'>
            {actionBranchOptions?.map((actionBranchOption, key) => (
                <ActionMessageOption
                    {...actionBranchOption}
                    key={key}
                    messageIndex={messageIndex}
                    messagesDepth={messagesDepth}
                    selectedOption={selectedOption}
                    handleMessageOptionSelect={() =>
                        handleMessageOptionSelect({
                            branchOptionLabel:
                                actionBranchOption?.actionBranchOptionTitle,
                            messageActionBranchId,
                            branchId: messageActionBranchId,
                            branchOptionId:
                                actionBranchOption?.actionBranchOptionId,
                            branchOptionValue:
                                actionBranchOption?.actionBranchOptionTitle,
                            branchOptionActionType:
                                actionBranchOption?.actionBranchOptionType,
                            ...actionBranchOption,
                        })
                    }
                    deliveryDate={deliveryDate}
                />
            ))}

            {isRelaxedTemplate && <PoweredBy />}
        </div>
    );
};

export default ActionMessageOptions;

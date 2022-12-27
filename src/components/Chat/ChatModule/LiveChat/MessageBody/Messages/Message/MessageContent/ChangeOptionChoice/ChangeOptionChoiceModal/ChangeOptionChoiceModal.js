import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import API from "lib/api";
import apiRoutes from "lib/api/apiRoutes";
import { getErrorMessage } from "utils/helper";
import { ErrorDialog } from "components/ui";
import ConfirmPrompt from "components/ui/ConfirmPrompt/ConfirmPrompt";
import { defaultTemplates, defaultThemes } from "hoc/AppTemplateWrapper/enum";
import PopupModal from "components/common/Modal/PopupModal/PopupModal";
import { messageTypes, appMessageUserTypes } from "../../../../enums";
import { clearTicketMessages } from "store/tickets/actions";

const { BRANCH, CONVERSATION } = messageTypes;
const { DARK_MODE_DEFAULT } = defaultThemes;
const { RELAXED } = defaultTemplates;

const ChangeOptionChoiceModal = ({
    show,
    toggle,
    setActiveConvo,
    requestAllMessages,
}) => {
    const [loading, setLoading] = useState(false);
    const [errorMssg, setErrorMssg] = useState("");
    const { defaultTemplate, defaultTheme } = useSelector(
        (state) => state?.chat?.chatSettings
    );

    const dispatch = useDispatch();

    const { activeTicket: ticket, ticketsMessages } = useSelector(
        (state) => state.tickets
    );
    const { ticketId } = ticket;
    const messages = ticketsMessages?.filter(
        (item) => item?.ticketId === ticketId
    );

    const changeLastBranchOptionChoice = async () => {
        try {
            setLoading(true);
            setErrorMssg();

            let allMessagesCopy = [...messages];
            let lastAgentMssg = [...allMessagesCopy]
                .reverse()
                ?.find(
                    (message) =>
                        message.senderType ===
                        appMessageUserTypes?.WORKSPACE_AGENT
                );

            if (
                lastAgentMssg?.messageType === CONVERSATION ||
                lastAgentMssg?.messageType === BRANCH
            ) {
                //
                setActiveConvo(false);
                // return ""
            }

            const url = apiRoutes?.changeTicketChoice(ticketId);
            const res = await API.post(url);
            if (res.status === 201) {
                requestAllMessages();
                dispatch(clearTicketMessages(ticketId));
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
            setErrorMssg(getErrorMessage(err));
        }
    };

    const isRelaxedTemplate = defaultTemplate === RELAXED;
    const isDarkModeTheme = defaultTheme === DARK_MODE_DEFAULT;

    return (
        <PopupModal
            show={show}
            toggle={toggle}
            isRelaxedTemplate={isRelaxedTemplate}
            isDarkModeTheme={isDarkModeTheme}>
            <div>
                <ErrorDialog
                    show={Boolean(errorMssg)}
                    message={errorMssg}
                    hide={() => setErrorMssg()}
                />
                <ConfirmPrompt
                    handleCancel={toggle}
                    handleConfirmation={changeLastBranchOptionChoice}
                    subTitle={`Are you sure you want to change the selected option?`}
                    loading={loading}
                    isRelaxedTemplate={isRelaxedTemplate}
                    isDarkModeTheme={isDarkModeTheme}
                />
            </div>
        </PopupModal>
    );
};

export default ChangeOptionChoiceModal;

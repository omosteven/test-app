import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Info } from "components/ui";
import BraillePatternDots from "./BraillePatternDots/BraillePatternDots";
import TogglerDropdown from "./TogglerDropdown/TogglerDropdown";
import TogglerModal from "./TogglerModal/TogglerModal";
import { defaultTemplates, defaultThemes } from "hoc/AppTemplateWrapper/enum";
import { changeTheme } from "store/chat/actions";

const { WORK_MODE } = defaultTemplates;
const { DARK_MODE_DEFAULT, WHITE_MODE_DEFAULT } = defaultThemes;

const ChatSettingsToggler = ({ isMobile, handleCloseTicket, }) => {
    const [showModal, toggleModal] = useState(false);
    const { defaultTemplate, defaultTheme } = useSelector(
        (state) => state.chat.chatSettings
    );
    const dispatch = useDispatch();

    const handleToggleModal = () => toggleModal(!showModal);

    const handleChangeTheme = () => {
        const theme =
            defaultTheme === DARK_MODE_DEFAULT
                ? WHITE_MODE_DEFAULT
                : DARK_MODE_DEFAULT;

        dispatch(changeTheme(theme));
    };

    const isWorkModeTemplate = defaultTemplate === WORK_MODE;
    const isDarkModeTheme = defaultTheme === DARK_MODE_DEFAULT;

    return (
        <>
            {isWorkModeTemplate ? (
                <TogglerDropdown
                    isMobile={isMobile}
                    handleCloseTicket={handleCloseTicket}
                    handleChangeTheme={handleChangeTheme}
                    isDarkModeTheme={isDarkModeTheme}
                />
            ) : (
                <Info
                    otherClass={"ticket-header__icon"}
                    onClick={handleToggleModal}>
                    <BraillePatternDots
                        onClick={handleToggleModal}
                        isMobile={isMobile}
                    />
                </Info>
            )}

            {showModal && (
                <TogglerModal
                    showModal={showModal}
                    toggleModal={handleToggleModal}
                    handleChangeTheme={handleChangeTheme}
                    handleCloseTicket={handleCloseTicket}
                    isDarkModeTheme={isDarkModeTheme}
                />
            )}
        </>
    );
};

export default ChatSettingsToggler;

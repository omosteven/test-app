import React from "react";
import { useSelector } from "react-redux";
import { defaultThemes, defaultTemplates } from "./enum";
import "./AppTemplateWrapper.scss";

const { WHITE_MODE_DEFAULT } = defaultThemes;
const { WORK_MODE } = defaultTemplates;

const AppTemplateWrapper = ({ children }) => {
    const { defaultTheme, defaultTemplate } = useSelector(
        (state) => state?.chat?.chatSettings
    );

    // const isRelaxedTemplate = defaultTemplate === RELAXED;
    const isWorkModeTemplate = defaultTemplate === WORK_MODE;
    // const isDarkModeTheme = defaultTheme === DARK_MODE_DEFAULT;

    return (
        <div
            className={`${
                // isWorkModeTemplate? "" :
                defaultTheme === WHITE_MODE_DEFAULT
                    ? "white-mode-default"
                    : "dark-mode-default"
            } ${isWorkModeTemplate ? "work-mode" : "relaxed-mode"}`}>
            {children}
        </div>
    );
};

export default AppTemplateWrapper;

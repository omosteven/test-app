import React from "react";
import { useSelector } from "react-redux";
import { DotLoader } from "components/ui";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import "./FullPageLoader.scss";

const { WORKMODE } = defaultTemplates;

const FullPageLoader = () => {
    const { defaultTemplate } = useSelector((state) => state.chat.chatSettings);

    const isWorkModeTemplate = defaultTemplate === WORKMODE;

    return (
        <div className='full__page_loader'>
            {isWorkModeTemplate ? (
                <span id='metaInfinite'>metacare</span>
            ) : (
                <DotLoader background={defaultTemplate === undefined} />
            )}
        </div>
    );
};

export default FullPageLoader;

import React from "react";
import { useSelector } from "react-redux";
import { DotLoader } from "components/ui";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import "./FullPageLoader.scss";

const { WORK_MODE } = defaultTemplates;

const FullPageLoader = () => {
    const { defaultTemplate } = useSelector((state) => state.chat.chatSettings);

    const isWorkModeTemplate = defaultTemplate === WORK_MODE;

    return (
        <div className='full__page_loader'>
            {isWorkModeTemplate ? (
                <span id='metaInfinite'>metacare</span>
            ) : (
                <DotLoader background={false}/>
            )}
        </div>
    );
};

export default FullPageLoader;

import React from "react";
// import { useSelector } from "react-redux";
import { ReactSVG } from "react-svg";
import imageLinks from "../../../../../assets/images";
// import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";

// const { WORKMODE } = defaultTemplates;
const ChatToggler = ({ ...restProps }) => {
    // const { defaultTemplate } = useSelector(
    //     (state) => state?.chat?.chatSettings
    // );

    // const isWorkModeTemplate = defaultTemplate === WORKMODE;

    return (
        <div className='chat__toggler' {...restProps}>
            <ReactSVG src={imageLinks?.svg?.leftArrow} />
            {/* {isWorkModeTemplate && <span>Chat</span>} */}
        </div>
    );
};

export default ChatToggler;

import React, { useState } from "react";
import { ReactSVG } from "react-svg";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import imageLinks from "assets/images";
import { Info } from "components/ui";
import BraillePatternDots from "../BraillePatternDots/BraillePatternDots";
import "./TogglerDropdown.scss";

const TogglerDropdown = ({
    isMobile,
    handleCloseTicket,
    handleChangeTheme,
    isDarkModeTheme,
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

    // const handleLogOut = async () => {
    //     let params = queryString.parse(window.location.search);
    //     const slugCC = params?.workspaceSlug;
    //     await sessionStorage.clear();
    //     window.location.replace(`/?workspaceSlug=${slugCC}`);
    //     await store.dispatch({ type: SIGNOUT_REQUEST });

    //     // history.push(`/?workspaceSlug=${workspaceSlug}`);
    // };

    return (
        <Dropdown isOpen={isDropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle
                tag='span'
                data-toggle='dropdown'
                aria-expanded={isDropdownOpen}>
                <Info otherClass={"ticket-header__icon"}>
                    <BraillePatternDots
                        onClick={toggleDropdown}
                        isMobile={isMobile}
                    />
                </Info>
            </DropdownToggle>
            <DropdownMenu tag='ul' className='toggler__dropdown' right>
                <li className='dropdown-item' onClick={handleChangeTheme}>
                    <div className='dropdown--item--group'>
                        <ReactSVG
                            src={imageLinks.svg.themeSun}
                            className='dropdown--item__sun__icon'
                        />
                        <span>
                            {isDarkModeTheme ? "Light Mode" : "Dark Mode"}
                        </span>
                    </div>
                </li>
                <li className='dropdown-item' onClick={handleCloseTicket}>
                    <div className='dropdown--item--group'>
                        <ReactSVG src={imageLinks?.svg?.leaveIcon} />
                        <span>Leave Chat</span>
                    </div>
                </li>
            </DropdownMenu>
        </Dropdown>
    );
};

export default TogglerDropdown;

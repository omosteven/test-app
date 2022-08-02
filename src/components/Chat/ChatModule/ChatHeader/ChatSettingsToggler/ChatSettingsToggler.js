import React from 'react';
import { useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import imageLinks from '../../../../../assets/images';
import { Info } from '../../../../ui';

const BraillePatternDots = ({ isMobile }) => {
    return (<ReactSVG src={isMobile ? imageLinks?.svg?.verticalGrey : imageLinks?.svg?.horizontalEllipsis} />)
}

const ChatSettingsToggler = ({ isMobile }) => {
	const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const { chatSettings: { workspaceSlug } } = useSelector(state => state.chat)
    const history = useHistory()
	const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
    
    const handleLogOut = () => {
        // deleteAccessToken();
        sessionStorage.clear()
        history.push(`/?workspaceSlug=${workspaceSlug}`);

    }

    return (
        <Dropdown isOpen={isDropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle
                tag="span"
                data-toggle="dropdown"
                aria-expanded={isDropdownOpen}
            >
                <Info otherClass={'ticket-header__icon'}>
                    <BraillePatternDots onClick={toggleDropdown} isMobile={isMobile}/>
                </Info>
            </DropdownToggle>

            <DropdownMenu tag="ul" right>
                <li
                    className="dropdown-item"
                    onClick={handleLogOut}
                >
                    <div className="dropdown--item--group">
                        <ReactSVG src={imageLinks?.svg?.leaveIcon} />
                        <span>Leave Chat</span>
                    </div>
                </li>
            </DropdownMenu>
        </Dropdown>
    );
};


export default ChatSettingsToggler;
import React from 'react';
import queryString from 'query-string'
import { ReactSVG } from 'react-svg';
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import imageLinks from '../../../../../assets/images';
import { Info } from '../../../../ui';
import store from 'store/store';
import { SIGNOUT_REQUEST } from 'store/rootReducer';

const BraillePatternDots = ({ isMobile }) => {
    return (<ReactSVG src={isMobile ? imageLinks?.svg?.verticalGrey : imageLinks?.svg?.horizontalEllipsis} />)
}

const ChatSettingsToggler = ({ isMobile }) => {
	const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
	const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
    
    const handleLogOut = async () => {
        let params = queryString.parse(window.location.search)
        const slugCC = params?.workspaceSlug;
        await sessionStorage.clear()
        window.location.replace(`/?workspaceSlug=${slugCC}`);
        await store.dispatch({type:SIGNOUT_REQUEST})


        // history.push(`/?workspaceSlug=${workspaceSlug}`);

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
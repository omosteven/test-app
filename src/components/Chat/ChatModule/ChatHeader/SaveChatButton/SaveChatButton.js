import imageLinks from "assets/images";
import { VERIFY_USER_ACTIONS } from "components/Chat/enums";
import { Button } from "components/ui";
import { ReactSVG } from "react-svg";
import "./SaveChatButton.scss";

const SaveChatButton = ({ handleVerifyAction, showVerifyForm }) => {
    const buttonText = (
        <>
            <span className='show-only-on-mobile'>Save</span>
            <span className='show-only-on-desktop'>Save conversation</span>
        </>
    );

    return (
        <>
            <Button
                icon={
                    <ReactSVG
                        src={
                            showVerifyForm
                                ? imageLinks.svg.close
                                : imageLinks.svg.add
                        }
                        className='save-chat__icon'
                    />
                }
                text={showVerifyForm ? "Close" : buttonText}
                otherClass={"save-chat__button"}
                onClick={() =>
                    handleVerifyAction(VERIFY_USER_ACTIONS.SAVE_CONVERSATION)
                }
            />
        </>
    );
};

export default SaveChatButton;

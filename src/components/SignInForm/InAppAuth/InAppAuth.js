import React from "react";
import { Button } from "components/ui";
import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";
import IntroHeader from "./IntroHeader/IntroHeader";
import IssueSuggestions from "./IssueSuggestions/IssueSuggestions";
import "./InAppAuth.scss";

export const inAppAuthActions = {
    ASK__SUPPORT: "ASK__SUPPORT",
    OPEN_OLD_CONVERSATIONS: " OPEN_OLD_CONVERSATIONS",
};

const { ASK__SUPPORT, OPEN_OLD_CONVERSATIONS } = inAppAuthActions;

const InAppAuth = ({ handleInitialRequestUpdate }) => {
    return (
        <div>
            <div>
                <IntroHeader title={true} text={`Hi there!`} />
                <IntroHeader
                    subtitle={true}
                    text={`Welcome to Cowrywise Support Center`}
                />
            </div>
            <div className='auth__buttons'>
                <Button
                    icon={
                        <ReactSVG src={imageLinks.svg.add} className='icon' />
                    }
                    text='Ask Support a Question'
                    classType='primary'
                    otherClass={`question__btn`}
                    onClick={() => handleInitialRequestUpdate(ASK__SUPPORT)}
                />
                <Button
                    text='Open an Old Conversation'
                    otherClass={`old__convo__btn`}
                    onClick={() =>
                        handleInitialRequestUpdate(OPEN_OLD_CONVERSATIONS)
                    }
                />
            </div>

            <IssueSuggestions title='Facing any of these issues?' />
        </div>
    );
};

export default InAppAuth;

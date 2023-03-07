import React from "react";
import { Button } from "components/ui";
import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";
import IntroHeader from "./IntroHeader/IntroHeader";
import PinnedConversations from "./PinnedConversations/PinnedConversations";
import { inAppAuthActions } from "../enum";
import "./InAppAuth.scss";

const { ASK__SUPPORT, OPEN_OLD_CONVERSATIONS } = inAppAuthActions;

const InAppAuth = ({ handleInitialRequestUpdate, routeToChat }) => {
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

            <PinnedConversations
                title='Facing any of these issues?'
                routeToChat={routeToChat}
            />
        </div>
    );
};

export default InAppAuth;

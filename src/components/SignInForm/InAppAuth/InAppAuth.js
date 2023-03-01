import React from "react";
import { Button } from "components/ui";
import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";
import IntroHeader from "./IntroHeader/IntroHeader";
import IssueSuggestions from "./IssueSuggestions/IssueSuggestions";
import "./InAppAuth.scss";

const InAppAuth = () => {
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
                    onClick={() => ""}
                />
                <Button
                    text='Open an Old Conversation'
                    otherClass={`old__convo__btn`}
                    onClick={() => ""}
                />
            </div>

            <IssueSuggestions title='Facing any of these issues?' />
        </div>
    );
};

export default InAppAuth;

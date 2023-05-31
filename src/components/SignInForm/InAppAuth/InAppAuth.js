import React from "react";
import { Button } from "components/ui";
import IntroHeader from "./IntroHeader/IntroHeader";
import PinnedConversations from "./PinnedConversations/PinnedConversations";
import { inAppAuthActions } from "../enum";
import CompanyChatLogo from "components/Chat/ChatModule/ChatHeader/CompanyChatLogo/CompanyChatLogo";
import { useSelector } from "react-redux";
import PoweredBy from "components/common/PoweredBy/PoweredBy";
import ChatHeaderBannerMessage from "components/Chat/ChatModule/ChatHeader/ChatHeaderBannerMessage/ChatHeaderBannerMessage";
import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";

import "./InAppAuth.scss";

const { ASK__SUPPORT, OPEN_OLD_CONVERSATIONS } = inAppAuthActions;

const InAppAuth = ({ handleInitialRequestUpdate, routeToChat }) => {
    const {
        chatSettings: {
            companyLogo,
            teamName,
            inAppLinks,
            inAppBackgroundImageUrl,
            hasWebHookEnabled,
        },
    } = useSelector((state) => state.chat);

    return (
        <div className='in-app-auth'>
            <div>
                <ChatHeaderBannerMessage
                    className='chat__header__banner__message__wrapper in-app-auth__banner'
                    message={`We will never ask you for your PIN or password`}
                    closeAction={() => console.log("")}
                />
            </div>
            <div className='row'>
                <div className='col-lg-5 col-sm-12 col-md-12 in-app-auth__hero'>
                    <div className='in-app-auth__brand-image'>
                        {inAppBackgroundImageUrl && (
                            <img
                                src={inAppBackgroundImageUrl}
                                alt='Background'
                            />
                        )}
                    </div>

                    <div className='in-app-auth__hero--content'>
                        <div className='in-app-auth__hero--logo'>
                            <CompanyChatLogo
                                src={companyLogo}
                                alt={teamName}
                                className='company__logo'
                                name={teamName}
                            />
                        </div>
                        <IntroHeader
                            title={true}
                            text={`Welcome to our Priority Support Center`}
                        />
                        {!hasWebHookEnabled && (
                            <Button
                                text='Continue an existing ticket'
                                classType='primary'
                                otherClass={`in-app-auth___tickets-button`}
                                onClick={() =>
                                    handleInitialRequestUpdate(ASK__SUPPORT)
                                }
                            />
                        )}
                        <div className='in-app-auth__external-links'>
                            <ul>
                                {inAppLinks?.map?.(({ title, value }, key) => (
                                    <li key={key}>
                                        <a href={value} target='__blank'>
                                            {title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className='col-lg-7 col-sm-12 col-md-12 in-app-auth__convos'>
                    <div>
                        <PinnedConversations
                            title='Report A Priority Issue'
                            routeToChat={routeToChat}
                            OPEN_OLD_CONVERSATIONS={OPEN_OLD_CONVERSATIONS}
                            handleInitialRequestUpdate={
                                handleInitialRequestUpdate
                            }
                            disableOpenOldConvos={hasWebHookEnabled}
                        />

                        {!hasWebHookEnabled && (
                            <div className='in-app-auth__convos--label'>
                                <ReactSVG src={imageLinks?.svg?.info} />
                                <span>
                                    If you had previously started a conversation
                                    with the link and saved it to your email,{" "}
                                    <span
                                        onClick={() =>
                                            handleInitialRequestUpdate(
                                                OPEN_OLD_CONVERSATIONS
                                            )
                                        }>
                                        Click here
                                    </span>
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <PoweredBy otherClassName={"in-app-auth__footer"} />
        </div>
    );
};

export default InAppAuth;

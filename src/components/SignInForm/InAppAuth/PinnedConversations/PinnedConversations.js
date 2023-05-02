import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import API from "lib/api";
import apiRoutes from "lib/api/apiRoutes";
import { getErrorMessage } from "utils/helper";
import PinnedConversation from "./PinnedConversation/PinnedConversation";
import { dataQueryStatus } from "utils/formatHandlers";
import { DotLoader } from "components/ui";
import ErrorView from "components/common/ErrorView/ErrorView";
import {
    storePinnedConversations,
    getStoredPinnedConversations,
} from "storage/localStorage";
import "./PinnedConversations.scss";

const { LOADING, ERROR, DATAMODE, NULLMODE } = dataQueryStatus;

const PinnedConversations = ({
    title,
    routeToChat,
    handleInitialRequestUpdate,
    OPEN_OLD_CONVERSATIONS,
}) => {
    const storedPinnedConversations = getStoredPinnedConversations() || [];
    const [pinnedConversations, setPinnedConversations] = useState(
        storedPinnedConversations || []
    );
    const [status, setStatus] = useState(
        storedPinnedConversations?.length > 0 ? DATAMODE : ""
    );
    const [errorMssg, setErrorMssg] = useState("");
    const { workspaceId } = useSelector((state) => state.chat.chatSettings);

    const getPinnedConversations = async () => {
        try {
            setStatus(LOADING);
            const url = apiRoutes.getPinnedConversations;
            const res = await API.get(url, {
                params: {
                    workspaceId,
                },
            });

            if (res.status === 200) {
                const { data } = res.data;

                let newStatus = data?.length > 0 ? DATAMODE : NULLMODE;
                setPinnedConversations(data);
                setStatus(newStatus);
                storePinnedConversations(data);
            }
        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    };

    useEffect(() => {
        if (
            storedPinnedConversations &&
            storedPinnedConversations?.length === 0
        ) {
            getPinnedConversations();
        }
        //eslint-disable-next-line
    }, []);

    const renderBasedOnStatus = () => {
        switch (status) {
            case LOADING:
                return (
                    <div className='pinned__conversations__loader'>
                        <DotLoader background={false} />
                    </div>
                );
            case DATAMODE:
                return (
                    <div className='pinned__conversations__list'>
                        {pinnedConversations
                            ?.slice(0, 6)
                            .map((convo, index) => (
                                <PinnedConversation
                                    key={index}
                                    issueTitle={convo?.issue?.issueName}
                                    onClick={() =>
                                        routeToChat(
                                            "",
                                            "",
                                            convo?.conversationId
                                        )
                                    }
                                />
                            ))}

                        <PinnedConversation
                            issueTitle="It's something else"
                            otherClass={`in-app-auth__convos--something-else`}
                            onClick={() =>
                                handleInitialRequestUpdate(
                                    OPEN_OLD_CONVERSATIONS
                                )
                            }
                        />
                    </div>
                );
            case ERROR:
                return (
                    <div className='pinned__conversations__error'>
                        <ErrorView
                            message={errorMssg}
                            retry={() => getPinnedConversations()}
                        />
                    </div>
                );
            default:
                return "";
        }
    };

    return (
        <div className='pinned__conversations'>
            <h3 className='pinned__conversations__title'>{title}</h3>
            {renderBasedOnStatus()}
        </div>
    );
};

export default PinnedConversations;

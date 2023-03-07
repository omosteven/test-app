import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import API from "lib/api";
import apiRoutes from "lib/api/apiRoutes";
import { getErrorMessage } from "utils/helper";
import PinnedConversation from "./PinnedConversation/PinnedConversation";
import { dataQueryStatus } from "utils/formatHandlers";
import { DotLoader } from "components/ui";
import { defaultTemplates } from "hoc/AppTemplateWrapper/enum";
import ErrorView from "components/common/ErrorView/ErrorView";
import "./PinnedConversations.scss";

const { LOADING, ERROR, DATAMODE, NULLMODE } = dataQueryStatus;
const { WORKMODE } = defaultTemplates;

const PinnedConversations = ({ title, routeToChat }) => {
    const [convo, setConvo] = useState([]);
    const [status, setStatus] = useState(LOADING);
    const [errorMssg, setErrorMssg] = useState("");
    const { workspaceId } = useSelector((state) => state.chat.chatSettings);
    const { defaultTemplate } = useSelector((state) => state.chat.chatSettings);

    const getPinnedConversations = async () => {
        try {
            const url = apiRoutes.getPinnedConversations;
            const res = await API.get(url, {
                params: {
                    workspaceId,
                },
            });

            if (res.status === 200) {
                console.log({ res });
                const { data } = res.data;

                let newStatus = data?.length > 0 ? DATAMODE : NULLMODE;
                setConvo(data);
                setStatus(newStatus);
            }
        } catch (err) {
            setStatus(ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    };

    useEffect(() => {
        getPinnedConversations();
    }, []);

    const isWorkModeTemplate = defaultTemplate === WORKMODE;

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
                        {convo?.map((convo) => (
                            <PinnedConversation
                                issueTitle={convo?.issue?.issueName}
                                onClick={() =>
                                    routeToChat("", "", convo?.conversationId)
                                }
                            />
                        ))}
                    </div>
                );
            case ERROR:
                return <ErrorView message={errorMssg} />;
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

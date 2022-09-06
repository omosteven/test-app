import React from "react";
import SuggestedConvo from "./SuggestedConvo/SuggestedConvo";
import "./SuggestedConvos.scss";

const SuggestedConvos = ({ data, handleConvoClick }) => {
    return (
        <div className='suggested__convos'>
            <p>Suggestions</p>
            <div className='suggestion__list'>
                {data?.map((convo, index) => (
                    <SuggestedConvo
                        key={index}
                        data={convo}
                        handleClick={() =>
                            handleConvoClick(convo?.conversationId)
                        }
                    />
                ))}
            </div>
        </div>
    );
};

export default SuggestedConvos;

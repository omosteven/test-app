import React from 'react';

const SuggestedMessage = ({ data }) => {
    const { messageContent } = data || {};
    return (
        <div
            className={`d-flex flex-column w-100 message__group align-items-end`}>
            <div className={`message__content sent sending shiny__background`}>
                { messageContent }
            </div>
        </div>
    );
};

export default SuggestedMessage;
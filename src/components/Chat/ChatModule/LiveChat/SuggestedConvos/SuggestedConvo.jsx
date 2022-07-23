import React from 'react';

const SuggestedConvo = ({data, handleClick}) => {
    const {conversationTitle} = data
    return (
        <div className='suggested__convo' onClick={handleClick}>
            <span>{conversationTitle}</span>{}
        </div>
    );
};

export default SuggestedConvo;
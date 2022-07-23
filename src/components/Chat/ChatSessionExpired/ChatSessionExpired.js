import React from 'react';

const ChatSessionExpired = () => {
    return (
        <div className='row justify-content-center align-items-center' style={{ height: "100vh"}}>
            <div className="col-md-4">
                <div className="expired__content">
                    <h2>Your Chat Session has expired</h2>
                </div>
            </div>
        </div>
    );
};

export default ChatSessionExpired;
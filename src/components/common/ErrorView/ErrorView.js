import React from 'react';

const ErrorView = ({ message, retry }) => {
    return (
        <div className='error__view'>
            <p>
                {message || "Something went wrong, please try again"} 
                {retry && <span className='retry__trigger' onClick={() => retry()}>Retry Now?</span>}
            </p>
        </div>
    );
};

export default ErrorView;
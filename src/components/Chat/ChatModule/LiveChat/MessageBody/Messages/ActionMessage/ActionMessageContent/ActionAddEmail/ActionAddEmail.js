import "./ActionAddEmail.scss";

const ActionAddEmail = ({ handleVerifyAction }) => {
    return (
        <>
            <div
                className='message__content add__email branch__option'
                onClick={handleVerifyAction}>
                Add email address
            </div>
        </>
    );
};

export default ActionAddEmail;

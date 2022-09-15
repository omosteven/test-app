import "./ActionAddEmail.scss";

const ActionAddEmail = ({ handleVerifyAction }) => {
    return (
        <>
            <div
                className='message__content add__email'
                onClick={handleVerifyAction}>
                Add email address
            </div>
        </>
    );
};

export default ActionAddEmail;

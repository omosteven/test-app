import imageLinks from "../../../../assets/images";
import { ReactSVG } from "react-svg";

const ToastContent = ({ message, isError, handleClose }) => {
    return (
        <>
            <div className='toast-content'>
                <div className='toast-content-leftside'>
                    <ReactSVG
                        src={
                            isError
                                ? imageLinks.svg?.mssgAlert
                                : imageLinks.svg?.plainInfo
                        }
                        className={"toast-info__logo"}
                    />
                </div>
                <div className='toast-content-message'>
                    <span>{message}</span>
                </div>
                <div
                    className='toast-content-rightside'
                    onClick={() => handleClose()}>
                    <ReactSVG
                        src={imageLinks.svg?.cancelX}
                        className='toast-cancel__logo'
                    />
                </div>
            </div>
        </>
    );
};

export default ToastContent;

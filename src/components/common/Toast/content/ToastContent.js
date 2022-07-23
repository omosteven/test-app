// import imageLinks from "assets/images";
// import { ReactSVG } from "react-svg";

const ToastContent = ({ message, isError }) => {
    return (
        <>
            <div className={`toast-content ${isError ? 'error' : ''}`}>
                {/* <div>
                    <ReactSVG
                        src={
                            isError
                                ? imageLinks.icons?.mssgAlert
                                : imageLinks.icons?.check
                        }
                    />
                </div> */}
                <div className='toast-content-message'>
                    <span>{message}</span>
                </div>
                {/* <div>
                    <ReactSVG src={imageLinks.icons?.cancel} />
                </div> */}
            </div>
        </>
    );
};

export default ToastContent;

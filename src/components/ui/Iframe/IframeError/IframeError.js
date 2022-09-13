import { ReactSVG } from "react-svg";
import asset from "assets/images";

const IframeError = ({ size = "30" }) => {
    return (
        <div className='custom-iframe-error'>
            <div>
                <div>
                    <ReactSVG
                        src={asset?.icons?.error}
                        className='d-inline-flex mb-2'
                        beforeInjection={(svg) => {
                            svg.setAttribute(
                                "style",
                                `width: ${size}px; height: ${size}px`
                            );
                        }}
                    />
                </div>
                <h6 className='text-dark mb-2'>Error!!</h6>
                <p className='text-dark'>Failed to load file</p>
            </div>
        </div>
    );
};

export default IframeError;

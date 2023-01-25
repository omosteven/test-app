import { ReactSVG } from "react-svg";
import asset from "assets/images";

const MediaDisplayError = ({size=32}) => {
    return (
        <div className='media-display-error'>
            <div>
                <div>
                    <ReactSVG
                        src={asset?.svg?.error}
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

export default MediaDisplayError;

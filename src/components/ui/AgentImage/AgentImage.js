import { ReactSVG } from "react-svg";
import assets from "../../../assets/images";

export const AgentImage = ({ active, src, alt }) => {
    return (
        <div className='position-relative'>
            <img
                src={src}
                alt={alt}
                width='20px'
                height='20px'
                className='rounded-circle'
            />
            {active && (
                <ReactSVG
                    src={assets.svg.success}
                    className='position-absolute top-50 end-0'
                />
            )}
        </div>
    );
};

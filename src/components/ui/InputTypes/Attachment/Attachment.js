import { ReactSVG } from "react-svg";
import "./AttachmentInput.scss";

const AttachmentInput = ({ id, src, accept, onChange, disabled }) => {
    return (
        <label htmlFor={id}>
            <ReactSVG src={src} className={disabled ? "disabled" : ""} />
            <input
                type='file'
                id={id}
                name='image'
                onChange={onChange}
                accept={accept}
                hidden
                disabled={disabled}
            />
        </label>
    );
};

export default AttachmentInput;

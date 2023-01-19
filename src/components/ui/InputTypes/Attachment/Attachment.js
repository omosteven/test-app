import { ReactSVG } from "react-svg";
import "./AttachmentInput.scss";

const AttachmentInput = ({
    id,
    src,
    accept,
    onChange,
    disabled,
    file,
    multiple,
    label,
}) => {
    return (
        <label
            htmlFor={id}
            className={`${label ? "upload--icons__label" : ""}`}>
            <ReactSVG src={src} className={disabled ? "disabled" : ""} />
            <input
                type='file'
                id={id}
                name='file'
                onChange={onChange}
                accept={accept}
                hidden
                disabled={disabled}
                key={file}
                multiple={multiple}
            />
            <span>{label}</span>
        </label>
    );
};

export default AttachmentInput;

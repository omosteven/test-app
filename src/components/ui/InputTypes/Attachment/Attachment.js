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
}) => {
    return (
        <label htmlFor={id}>
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
        </label>
    );
};

export default AttachmentInput;

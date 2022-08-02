import { ReactSVG } from "react-svg";

const AttachmentInput = ({ id, src, accept, onChange }) => {
    return (
        <label htmlFor={id}>
            <ReactSVG src={src} />
            <input
                type='file'
                id={id}
                name='image'
                onChange={onChange}
                accept={accept}
                hidden
            />
        </label>
    );
};

export default AttachmentInput;

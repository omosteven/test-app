import "./Info.scss";

export const Info = ({ children, otherClass, onClick }) => {
    return (
        <div
            className={`info__box ${otherClass ? otherClass : ""} info`}
            onClick={onClick}>
            {children}
        </div>
    );
};

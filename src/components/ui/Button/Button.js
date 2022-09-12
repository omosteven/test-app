import SmallLoader from "../SmallLoader/SmallLoader";

export const Button = ({
  text,
  type,
  classType,
  otherClass,
  disabled,
  onClick,
  loading,
  icon,
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`btn ${classType ? `btn-${classType}` : ''} ${otherClass || ""
        }`}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {
        loading ? <SmallLoader /> : <>
          {icon}
          {text && <span>{text}</span>}
        </>
      }
      {/* {loading && (
        <div
          className="spinner-border spinner-border-sm text-white me-2"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      )} */}

    </button>
  );
};

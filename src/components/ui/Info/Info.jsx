export const Info = ({ children, otherClass }) => {
  return (
    <div
      className={`info__box ${
        otherClass ? otherClass : ""
      } info`}
    >
      {children}
    </div>
  );
};

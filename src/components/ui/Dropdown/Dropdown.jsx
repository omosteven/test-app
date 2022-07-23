import { useState, useEffect } from "react";
import asset from "../../../assets/images";

export const Dropdown = ({
  size,
  placeholder,
  options,
  onChange,
  ddValue,
  ddValueClass,
  optClass,
  className,
  ddOptionsClass,
  anchor = true,
  changeValue = true,
}) => {
  const [selected, setSelected] = useState(ddValue || { value: "", label: "" });
  const [show, setShow] = useState(false);

  useEffect(() => {
    document.body.addEventListener("click", () => setShow(false));

    return () =>
      document.body.removeEventListener("click", () => setShow(false));
  }, []);

  const handleChange = (item) => {
    changeValue && setSelected(item);
    onChange?.(item);
    setShow(false);
  };

  return (
    <div
      className={`position-relative custom-dropdown ${className || ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={`text-dark selected cursor-pointer d-flex justify-content-between align-items-center selected--${size} selected--${
          ddValueClass || ""
        }`}
        onClick={() => setShow(!show)}
      >
        {selected?.label || placeholder}{" "}
        {anchor ? <img src={asset?.svg?.anchorDown} alt="dropdown" /> : null}
      </div>
      {show ? (
        <div
          className={`position-absolute end-0 options w-100 options--${
            ddOptionsClass || ""
          }`}
        >
          {options?.length ? (
            options?.map((item, i) => (
              <p
                className={`mb-0 text-dark cursor-pointer opt opt--${
                  optClass || ""
                } ${item?.value === selected?.value ? "opt--selected" : ""}`}
                key={i}
                onClick={() => handleChange(item)}
              >
                {item?.label}
              </p>
            ))
          ) : (
            <p className="mb-0 text-dark opt">No item</p>
          )}
        </div>
      ) : null}
    </div>
  );
};

import React, { forwardRef } from "react";

// eslint-disable-next-line react/display-name
export const Textarea = forwardRef(({
  name,
  id,
  label,
  labelClass,
  grpClass,
  inputClass,
  type,
  placeholder,
  isErr,
  isValid,
  errMssg,
  extraMssg,
  isLoading,
  value,
  maxLength,
  onChange,
  disabled,
  hideLabel,
}, ref) => {
  return (
    <div className={`form-group ${grpClass || ""}`}>
      <label
        htmlFor={id}
        className={`form-label ${labelClass || ""} ${disabled ? "text-muted" : ""
          }  ${hideLabel ? "d-none" : "d-block"}`}
      >
        {label}
      </label>
      <textarea
        type={type}
        name={name}
        id={id}
        rows={1}
        ref={ref}
        className={`form-control ${isLoading
          ? "is-loading"
          : isErr
            ? "is-invalid"
            : isValid
              ? "is-valid"
              : ""
          } ${inputClass || ""}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        disabled={disabled}
      />
      {extraMssg ? (
        <div className="text-muted extra-input-mssg">{extraMssg}</div>
      ) : null}
      <div className="invalid-feedback">{errMssg}</div>
    </div>
  );
});

import React, { forwardRef } from "react";

// eslint-disable-next-line react/display-name
export const Input = forwardRef(({
  name,
  id,
  label,
  labelClass,
  grpClass,
  inputClass,
  type = "text",
  placeholder,
  isErr,
  isValid,
  errMssg,
  extraMssg,
  isLoading,
  value,
  disabled,
  onChange,
  fieldType,
  onBlur,
  onKeyDown,
  onKeyUp,
  hideLabel,
  ...restProps
}, ref) => {
  return (
    <>
      <div className={`form-group ${grpClass || ""}`}>
        <label
          htmlFor={id}
          className={`form-label ${labelClass || ""} ${disabled ? "text-muted" : ""
            } ${hideLabel ? "d-none" : "d-block"}`}
        >
          {label}
        </label>

        <input
          type={type}
          name={name}
          ref={ref}
          id={id}
          data-label={label}
          className={`form-control ${isLoading
              ? "is-loading"
              : isErr
                ? "is-invalid"
                : isValid
                  ? "is-valid"
                  : ""
            } ${inputClass || ""}`}
          placeholder={placeholder}
          disabled={disabled}
          data-field={fieldType}
          onChange={onChange}
          value={value}
          autoComplete="off"
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onBlur={onBlur}
          {...restProps}
        />
        {extraMssg ? (
          <div className="text-muted extra-input-mssg">{extraMssg}</div>
        ) : null}
        <div className="invalid-feedback">{errMssg}</div>
      </div>
    </>
  );
});

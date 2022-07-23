import React from "react";
import ReactSelect from "react-select";

const SelectUI = ({ error, handleChange, options, optionValueKey, optionLabelKey, label, defaultValue, isLoading, serverError, handleRetry, ...rest }) => {
    return (
        <div className="form-group mb-3">
            <label className='select__label fs-17 text-primary fw-medium'>{label}</label>
            <ReactSelect
                className="select__box"
                classNamePrefix='react-select'
                onChange={({ value }, { name }) => handleChange(value)}
                options={options}
                getOptionLabel={(option) => (optionLabelKey ? option[optionLabelKey] : option.label)}
                getOptionValue={(option) => (optionValueKey ? option[optionValueKey] : option.value)}
                defaultValue={defaultValue}
                menuPortalTarget={document.body} 
                styles={{ 
                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                    control: (styles, { isFocused }) => ({
                        ...styles,
                        border: `0 !important`
                    })
                }}
                menuPlacement="top"
                {...rest}
            />
        </div>
    );
};

export default SelectUI;
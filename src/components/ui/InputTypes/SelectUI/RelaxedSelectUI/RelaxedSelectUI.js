import { useState } from "react";
import RelaxedSelectUIOption from "./RelaxedSelectUIOption/RelaxedSelectUIOption";
import "./RelaxedSelectUI.scss";

const RelaxedSelectUI = ({ options, handleChange }) => {
    const [selectedOption, selectOption] = useState();

    const handleSelect = (value) => {
        selectOption(value);
        handleChange(value);
    };

    return (
        <>
            <div className='relaxed-selectui'>
                {options?.map(({ label, value }, key) => (
                    <RelaxedSelectUIOption
                        label={label}
                        key={key}
                        isSelected={value === selectedOption}
                        onClick={() => handleSelect(value)}
                    />
                ))}
            </div>
        </>
    );
};

export default RelaxedSelectUI;

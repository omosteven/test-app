const RelaxedSelectUIOption = ({ label, isSelected, ...rest }) => {
    return (
        <>
            <div
                className={`relaxed-selectui__option  ${
                    isSelected ? "active" : ""
                }`}
                {...rest}>
                <span>{label}</span>
            </div>
        </>
    );
};

export default RelaxedSelectUIOption;

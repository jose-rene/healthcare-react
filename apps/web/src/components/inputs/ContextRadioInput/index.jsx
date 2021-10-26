import React from "react";

const ContextRadioInput = (
    { name, label = "", warpperClass, onChange: propsOnChange },
    ref
) => {
    const handleOnChange = (e) => {
        if (propsOnChange) {
            return propsOnChange(e);
        }
    };

    return (
        <div className={warpperClass}>
            <input
                className="form-check-input m-1 me-2"
                type="radio"
                name={name}
                ref={ref}
                value={label}
                onChange={handleOnChange}
            />
            <label className="form-check-label" htmlFor={name}>
                {label}
            </label>
        </div>
    );
};
ContextRadioInput.displayName = "ContextRadioInput";

export default React.forwardRef(ContextRadioInput);

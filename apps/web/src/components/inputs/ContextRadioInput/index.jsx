import React from "react";

const ContextRadioInput = (
    {
        name,
        label = "",
        wrapperClass,
        onChange: propsOnChange,
        checked = false,
    },
    ref
) => {
    const handleOnChange = (e) => {
        if (propsOnChange) {
            return propsOnChange(e);
        }
    };

    return (
        <div className={wrapperClass}>
            <label className="form-check-label" htmlFor={`${name}-${label}`}>
                <input
                    id={`${name}-${label}`}
                    className="form-check-input m-1 me-2"
                    type="radio"
                    name={name}
                    ref={ref}
                    value={label}
                    checked={checked}
                    onChange={handleOnChange}
                />
                {label}
            </label>
        </div>
    );
};
ContextRadioInput.displayName = "ContextRadioInput";

export default React.forwardRef(ContextRadioInput);

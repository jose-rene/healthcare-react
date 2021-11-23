import React, { useMemo } from "react";

const ContextRadioInput = (
    {
        name,
        label = "",
        wrapperClass,
        onChange: propsOnChange,
        checked = false,
        inline = false,
    },
    ref
) => {
    const handleOnChange = (e) => {
        if (propsOnChange) {
            return propsOnChange(e);
        }
    };

    const classAppend = useMemo(() => {
        return inline ? " form-check-inline" : "";
    }, [inline]);

    return (
        <div className={`${wrapperClass}${classAppend}`}>
            <label className="form-check-label" htmlFor={`${name}-${label}`}>
                {label}
            </label>
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
        </div>
    );
};
ContextRadioInput.displayName = "ContextRadioInput";

export default React.forwardRef(ContextRadioInput);

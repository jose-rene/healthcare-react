import React, { useMemo } from "react";

const ContextRadioInput = (
    {
        name,
        label = "",
        wrapperClass,
        onChange: propsOnChange,
        checked = false,
        inline = false,
        labelRight = false,
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

    const labelHtml = useMemo(() => {
        return (
            <label className="form-check-label" htmlFor={`${name}-${label}`}>
                {label}
            </label>
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [label, labelRight]);

    return (
        <div className={`${wrapperClass}${classAppend}`}>
            {!labelRight && labelHtml}{" "}
            <input
                id={`${name}-${label}`}
                className="form-check-input m-1 me-2"
                type="radio"
                name={name}
                ref={ref}
                value={label}
                checked={checked}
                onChange={handleOnChange}
            />{" "}
            {labelRight && labelHtml}
        </div>
    );
};
ContextRadioInput.displayName = "ContextRadioInput";

export default React.forwardRef(ContextRadioInput);

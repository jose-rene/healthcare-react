import React from "react";
import { useFormContext } from "../../../Context/FormContext";

const Checkbox = (
    { name, label = "", disableFn, wrapperClass, ...otherProps },
    ref
) => {
    const { form, getValue, onChange } = useFormContext();

    const id = name;
    const value = getValue ? getValue(name) : otherProps.value;

    const disabled = disableFn ? disableFn(form) : false;

    return (
        <div className={wrapperClass}>
            <input
                className="form-check-input m-1 me-2"
                type="checkbox"
                name={name}
                id={id}
                value={value}
                checked={disabled ? false : value}
                ref={ref}
                disabled={disabled}
                onChange={onChange}
            />
            <label className="form-check-label" htmlFor={name}>
                {label}
            </label>
        </div>
    );
};
Checkbox.displayName = "Checkbox";

export default React.forwardRef(Checkbox);

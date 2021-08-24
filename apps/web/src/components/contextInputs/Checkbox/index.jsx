import React from "react";
import { useFormContext } from "../../../Context/FormContext";

const Checkbox = ({ name, label = "", disableFn, ...otherProps }, ref) => {
    const { form, getValue, onChange } = useFormContext();

    const id = name;
    const value = getValue ? getValue(name) : otherProps.value;

    const disabled = disableFn ? disableFn(form) : false;

    return (
        <div>
            <input
                className="form-check-input"
                type="checkbox"
                name={name}
                id={id}
                value={value}
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

import React from "react";
import { Form } from "react-bootstrap";

const Checkbox = (
    {
        name,
        label = "",
        inline = false,
        type = "checkbox",
        autocomplete = false,
        className = false,
        classNameAppend = "",
        helpText = false,
        errors = {},
        labelLeft = false,
        hasError: _hasError = false,
        ...otherProps
    },
    ref
) => {
    const { [name]: { message = false } = {} } = errors;
    const hasError = !!message || _hasError;

    return (
        <div className={inline ? "form-check form-check-inline" : "form-group"}>
            {labelLeft === false && label &&
            <Form.Label htmlFor={name} className="pe-2">{label}</Form.Label>}
            <input
                type={type}
                id={name}
                name={name}
                autoComplete={autocomplete || name}
                className={
                    className ||
                    `form-check-input ${
                        hasError ? " is-invalid" : ""
                    } ${classNameAppend}`
                }
                ref={ref}
                {...otherProps}
            />
            {labelLeft && label &&
            <Form.Label htmlFor={name} className="ps-2">{label}</Form.Label>}
            {helpText && (
                <Form.Text className="text-muted form-text">
                    {helpText}
                </Form.Text>
            )}
            {hasError && message && (
                <Form.Text className="invalid-feedback mt-3">
                    {message}
                </Form.Text>
            )}
        </div>
    );
};
Checkbox.displayName = "Checkbox";

export default React.forwardRef(Checkbox);

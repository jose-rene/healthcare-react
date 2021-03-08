import React from "react";
import { Form } from "react-bootstrap";

const Select = (
    {
        name,
        label = "",
        inlineLabel = false,
        options = [],
        autocomplete = false,
        className = false,
        classNameAppend = "",
        helpText = false,
        errors = {},
        labelClass = "",
        wrapperClass = false,
        labelKey = "title",
        valueKey = "val",
        ...otherProps
    },
    ref
) => {
    const { [name]: { message = false } = {} } = errors;
    const hasError = !!message;
    const selectOptions = options.map((option) => (
        <option key={option.id} value={option[valueKey]}>
            {option[labelKey]}
        </option>
    ));
    return (
        <div
            className={`${wrapperClass ? "wrapperClass" : "form-group"} ${
                inlineLabel ? "d-flex" : ""
            }`}
        >
            {label && (
                <Form.Label
                    htmlFor={name}
                    className={
                        (labelClass || "") + (inlineLabel ? " col pt-2" : "")
                    }
                >
                    {label}
                </Form.Label>
            )}
            <select
                id={name}
                name={name}
                autoComplete={autocomplete || name}
                className={`${inlineLabel ? "col " : ""}${
                    className ||
                    `form-control ${
                        hasError ? " is-invalid" : ""
                    } ${classNameAppend}`
                }`}
                ref={ref}
                {...otherProps}
            >
                {selectOptions}
            </select>
            {helpText && (
                <Form.Text className="text-muted form-text">
                    {helpText}
                </Form.Text>
            )}
            {hasError && (
                <Form.Text className="invalid-feedback mt-3">
                    {message}
                </Form.Text>
            )}
        </div>
    );
};
Select.displayName = "Select";

export default React.forwardRef(Select);

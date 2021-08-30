import React from "react";
import { Form, FloatingLabel } from "react-bootstrap";

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
        addEmpty = false,
        emptyLabel = "Select an option",
        ...otherProps
    },
    ref,
) => {
    const { [name]: { message = false } = {} } = errors;
    const hasError = !!message;
    const selectOptions = options.map(({ id, [valueKey]: optionValue, [labelKey]: optionLabel, ...otherProps }) => (
        <option key={id} value={optionValue} {...otherProps}>
            {optionLabel}
        </option>
    ));

    return (
        <FloatingLabel controlId={name} label={label} hasValidation>
            <Form.Select
                id={name}
                name={name}
                aria-label={label}
                isInvalid={hasError}
                ref={ref}
                {...otherProps}
            >
                {addEmpty && <option>{emptyLabel}</option>}
                {selectOptions}
            </Form.Select>
            {helpText && (
                <Form.Text className="text-muted form-text">
                    {helpText}
                </Form.Text>
            )}
            <Form.Control.Feedback type="invalid">
                {message}
            </Form.Control.Feedback>
        </FloatingLabel>
    );
};
Select.displayName = "Select";

export default React.forwardRef(Select);

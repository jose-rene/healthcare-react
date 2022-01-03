import React, { useMemo } from "react";
import { Form, FloatingLabel } from "react-bootstrap";
import { useFormContext } from "Context/FormContext";

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
        disabled = false,
        ...otherProps
    },
    ref
) => {
    const { getValue, getError, onChange } = useFormContext();

    const id = name;
    const value = getValue ? getValue(name) : otherProps.value;
    const message = getError ? getError({ name }) : errors[0]?.message;
    const hasError = !!message;

    const handleOnChange = (e) => {
        if (otherProps.onChange) {
            otherProps.onChange(e);
        } else {
            onChange(e);
        }
    };

    const selectOptions = options.map(
        ({
            id,
            [valueKey]: optionValue,
            [labelKey]: optionLabel,
            ...otherProps
        }) => (
            <option key={id} value={optionValue} {...otherProps}>
                {optionLabel}
            </option>
        )
    );

    const _wrapperClass = useMemo(() => {
        let label = `mb-3 form-floating ${
            wrapperClass ? "wrapperClass" : "form-group"
        }`;

        if (inlineLabel) {
            label += " d-flex";
        }

        return label;
    }, [wrapperClass, inlineLabel]);

    const selectClass = useMemo(() => {
        return `${inlineLabel ? "col " : ""}${
            className || `${hasError ? "is-invalid" : ""} ${classNameAppend}`
        }`;
    }, [inlineLabel, className, hasError, classNameAppend]);

    return (
        <div className={_wrapperClass}>
            <FloatingLabel id={id} label={label}>
                <Form.Select
                    className={selectClass}
                    id={name}
                    name={name}
                    ref={ref}
                    value={value}
                    disabled={disabled}
                    onChange={handleOnChange}
                >
                    {selectOptions}
                </Form.Select>
            </FloatingLabel>
            {helpText && (
                <Form.Text className="text-muted form-text">
                    {helpText}
                </Form.Text>
            )}
            {hasError && (
                <Form.Text className="invalid-feedback d-block">
                    {message}
                </Form.Text>
            )}
        </div>
    );
};
Select.displayName = "Select";

export default React.forwardRef(Select);

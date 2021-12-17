import React, { useMemo } from "react";
import { Form, FloatingLabel } from "react-bootstrap";

const BaseSelect = (
    {
        name,
        value,
        label = "",
        inlineLabel = false,
        options: _options = [],
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
        onChange,
        ...otherProps
    },
    ref
) => {
    const id = name;

    const { [name]: { message = false } = {} } = errors;
    const hasError = !!message;

    const selectOptions = useMemo(() => {
        let _selectOptions = [];

        if (addEmpty) {
            _selectOptions = [
                { [labelKey]: emptyLabel, value: null },
                ..._options,
            ];
        } else {
            _selectOptions = [..._options];
        }

        return _selectOptions.map(
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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_options]);

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
                    onChange={onChange}
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
BaseSelect.displayName = "Select";

export default React.forwardRef(BaseSelect);

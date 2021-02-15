import React, { useMemo } from "react";
import { Form } from "react-bootstrap";

const Select = (
    {
        name,
        label = "",
        placeholder = false,
        options = [],
        autocomplete = false,
        className = false,
        classNameAppend = "",
        helpText = false,
        errors = {},
        ...otherProps
    },
  ref
) => {
    const { [name]: { message = false } = {} } = errors;
    const hasError = !!message;

    const selectOptions = useMemo(() => {
        return options.map((option) => (
            <option key={option.id} value={option.val}>
                {option.title}
            </option>
        ));
    }, [options]);

    return (
        <div className="form-group">
            {label && <Form.Label htmlFor={name}>{label}</Form.Label>}
            <select
                id={name}
                name={name}
                autoComplete={autocomplete || name}
                className={
                    className ||
          `form-control ${hasError ? " is-invalid" : ""} ${classNameAppend}`
        }
        ref={ref}
        {...otherProps}
      >
                {placeholder && <option value={null}>{placeholder}</option>}
                {selectOptions}
      </select>
      {helpText && (
        <Form.Text className="text-muted form-text">{helpText}</Form.Text>
      )}
      {hasError && (
        <Form.Text className="invalid-feedback mt-3">{message}</Form.Text>
      )}
    </div>
  );
};
Select.displayName = "Select";

export default React.forwardRef(Select);

import React from "react";
import { Form } from "react-bootstrap";

const Textarea = (
  {
    name,
    label = "",
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

  return (
    <div className="form-group">
      {label && <Form.Label htmlFor={name}>{label}</Form.Label>}
      <textarea
        id={name}
        name={name}
        autoComplete={autocomplete || name}
        className={
          className ||
          `form-control ${hasError ? " is-invalid" : ""} ${classNameAppend}`
        }
        ref={ref}
        {...otherProps}
      />
      {helpText && (
        <Form.Text className="text-muted form-text">{helpText}</Form.Text>
      )}
      {hasError && (
        <Form.Text className="invalid-feedback mt-3">{message}</Form.Text>
      )}
    </div>
  );
};
Textarea.displayName = "Textarea";

export default React.forwardRef(Textarea);

import React, { useEffect, createRef } from "react";
import { Form, FloatingLabel } from "react-bootstrap";

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
    const _ref = ref || createRef();

    useEffect(() => {
        if (otherProps.initialValue) {
            console.log("ref", { _ref });
            _ref.current.value = otherProps.initialValue;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <FloatingLabel label={label} className="mb-3 form-group">
            <textarea
                id={name}
                name={name}
                autoComplete={autocomplete || name}
                className={
                    className ||
                    `form-control ${
                        hasError ? " is-invalid" : ""
                    } ${classNameAppend}`
                }
                ref={_ref}
                {...otherProps}
            />
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
        </FloatingLabel>
    );
};
Textarea.displayName = "Textarea";

export default React.forwardRef(Textarea);

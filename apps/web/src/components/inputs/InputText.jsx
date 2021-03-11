import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import Icon from "../elements/Icon";

const InputText = (
    {
        name,
        prepend = null,
        label = "",
        type = "text",
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

    const getInput = () => {
        return (
            <input
                id={name}
                type={type}
                name={name}
                autoComplete={autocomplete || name}
                className={
                    className ||
                    `form-control ${
                        hasError ? " is-invalid" : ""
                    } ${classNameAppend}`
                }
                ref={ref}
                {...otherProps}
            />
        );
    };

    return (
        <div className="form-group">
            {label && <Form.Label htmlFor={name}>{label}</Form.Label>}
            {prepend ? (
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">
                            <Icon icon={prepend} size="lg" />
                        </InputGroup.Text>
                    </InputGroup.Prepend>{" "}
                    {getInput()}
                </InputGroup>
            ) : (
                getInput()
            )}
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
InputText.displayName = "InputText";

export default React.forwardRef(InputText);

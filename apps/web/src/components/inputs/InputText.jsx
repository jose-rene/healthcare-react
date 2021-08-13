import React, { useMemo, forwardRef } from "react";
import { has, set } from "lodash";
import { InputGroup, Form } from "react-bootstrap";

const Base = ({ children }) => <div className="input-group">{children}</div>;
Base.Input = forwardRef((props, ref) => <Form.Control {...props} ref={ref} />);
Base.Addon = ({ children, textProps, ...props }) => (
    <InputGroup.Append {...props}>
        <InputGroup.Text {...textProps}>{children}</InputGroup.Text>
    </InputGroup.Append>
);

const InputText = forwardRef((props, ref) => {
    const {
        type = "text",
        name = undefined,
        className = "form-control",
        outerClassReplace = "form-group ",
        outerClassName = "",
        help = false,
        attributes: _attributes = [],
        label = "",
        label_attrs = {},
        withIcon = false,
        wrap = true,
        required = false,
        error = false,
        value = "",
        onLblDoubleClick = undefined,
        feedbackClassName,
        large = false,
        onChange,
        ...others
    } = props;

    const { id = name } = others;

    const handleOnChange = (e) => {
        if (onChange) {
            onChange(e);
        }
    };

    // Required to be set
    const attributes = {
        type,
        className,
        id,
        name,
        required,
        value,
        ...others,
        ..._attributes,
    };

    if (large) {
        set(attributes, "style.height", 56);
    }

    attributes["onChange"] = handleOnChange;

    const renderHelpBlock = (help) => {
        if (!help) {
            return null;
        }

        return <small className="form-text text-muted">{help}</small>;
    };

    const errorBlock = useMemo(() => {
        if (!error) {
            return null;
        }

        return (
            <Form.Control.Feedback type="invalid" className={feedbackClassName}>
                {error}
            </Form.Control.Feedback>
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    if (has(attributes, "value.amount")) {
        attributes.value = attributes.value.amount;
    }

    const { ...input_attributes } = attributes;

    input_attributes["ref"] = ref;
    input_attributes["isInvalid"] = error;

    // if (!input_attributes.value) input_attributes.value = '';

    if (type === "email") {
        // For email input types we need to use a pattern
        input_attributes.type = "email";
    }

    const typeMap = {
        money: () => (
            <Base>
                <Base.Addon>$</Base.Addon>
                <Base.Input {...input_attributes} />
            </Base>
        ),
        number: () => {
            return (
                <Base>
                    <Base.Addon>$</Base.Addon>
                    <Base.Input {...input_attributes} />
                    <Base.Addon>.00</Base.Addon>
                </Base>
            );
        },
        percent: () => {
            input_attributes.step = ".0001";

            return (
                <Base>
                    <Base.Input {...input_attributes} />
                    <Base.Addon>%</Base.Addon>
                </Base>
            );
        },
        date: () => {
            input_attributes.placeholder = "MM/DD/YYYY";

            return (
                <Base>
                    <Base.Addon>$</Base.Addon>
                    <Base.Input {...input_attributes} />
                    <Base.Addon>
                        <i className="far fa-calendar-alt" />
                    </Base.Addon>
                </Base>
            );
        },
        time: () => {
            input_attributes.placeholder = "HH:MM AM/PM";

            return (
                <Base>
                    <Base.Addon>$</Base.Addon>
                    <Base.Input {...input_attributes} />
                    <Base.Addon>
                        <i className="fa fa-clock-o" />
                    </Base.Addon>
                </Base>
            );
        },
        auction_date: () => {
            input_attributes.placeholder = "MM/DD/YYYY";

            return (
                <Base>
                    <Base.Input {...input_attributes} />
                    <Base.Addon>
                        <i className="far fa-calendar-alt" />
                    </Base.Addon>
                </Base>
            );
        },
        auction_time: () => {
            input_attributes.placeholder = "HH:MM AM/PM";

            return (
                <Base>
                    <Base.Input {...input_attributes} />
                    <Base.Addon>
                        <i className="fa fa-clock-o" />
                    </Base.Addon>
                </Base>
            );
        },
        search: () => {
            return (
                <Base>
                    <Base.Input {...input_attributes} error={error} />
                    <Base.Addon textProps={{ className: "p-0 border-0" }}>
                        <button
                            type="submit"
                            className="btn btn-regular btn-blue btn-search"
                        >
                            <i className="fa fa-search fa-lg" />
                        </button>
                    </Base.Addon>
                </Base>
            );
        },
        default: () => <Base.Input {...input_attributes} />,
    };

    return !wrap ? (
        <Base.Input {...input_attributes} />
    ) : (
        <div
            className={`form-floating mb-3 ${outerClassReplace} ${outerClassName}`}
        >
            {typeMap[withIcon || "default"]()}
            <label
                htmlFor={attributes.id}
                className="control-label"
                {...label_attrs}
                onDoubleClick={onLblDoubleClick}
            >
                {label}
            </label>
            {renderHelpBlock(help)}
            {errorBlock}
        </div>
    );
});

export default InputText;

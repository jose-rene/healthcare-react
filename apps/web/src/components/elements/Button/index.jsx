import React, { useMemo } from "react";
import { Button as RButton } from "react-bootstrap";

import FapIcon from "../FapIcon";
import { useFormContext } from "../../../Context/FormContext";

const Button = ({
    size = "lg",
    onClick = undefined,
    variant = "primary",
    label = undefined,
    children,
    type = "button",
    block = false,
    outline = false,
    className = null,
    bold = false,
    icon = undefined,
    iconSize = undefined,
    disabled = false,
    loading = false,
    name = undefined,
    value = undefined,
}) => {
    const { update } = useFormContext();

    const handleOnClick = (e) => {
        if (name && update) {
            update(name, value);
        }

        onClick && onClick(e);
    };

    const renderedLabel = useMemo(() => {
        const lbl = label || children;

        return bold ? <strong>{lbl}</strong> : lbl;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [label, children]);

    return (
        <RButton
            variant={variant}
            size={size}
            // eslint-disable-next-line react/button-has-type
            type={type}
            onClick={handleOnClick}
            disabled={disabled}
            className={`${className ?? ""}${block ? " btn-block" : ""}`}
        >
            {icon && (
                <FapIcon
                    className={`${renderedLabel ? "me-3" : ""}`}
                    icon={icon}
                    size={iconSize || size}
                />
            )}
            {renderedLabel}
            {loading && (
                <span className="ms-2">
                    <FapIcon icon="spinner" size={iconSize || size} />
                </span>
            )}
        </RButton>
    );
};

export default Button;

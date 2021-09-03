import React, { useMemo } from "react";
import Icon from "../Icon";
import { Button as RButton } from "react-bootstrap";

const Button = ({
    size = "lg",
    onClick = undefined,
    variant = "default",
    label = undefined,
    children,
    type = "button",
    block = false,
    outline = false,
    className: classAppend = "",
    bold = false,
    icon = undefined,
    iconSize = undefined,
    disabled = false,
    loading = false,
}) => {
    const className = useMemo(() => {
        let cName = `btn ${classAppend}`;

        switch (variant.toLowerCase()) {
            case "cancel":
            case "warn":
                cName += " btn-outline-secondary";
                break;
            case "secondary":
                cName += " btn-secondary";
                break;

            case "icon":
                cName = " btn-icon";
                break;
            default:
                cName += outline
                    ? ` btn-outline-${variant}`
                    : ` btn-${variant}`;
                break;
        }

        if (block) {
            cName += " btn-block";
        }

        return cName;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outline, variant, block]);

    const renderedLabel = useMemo(() => {
        const lbl = label || children;

        return bold ? <strong>{lbl}</strong> : lbl;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [label, children]);

    return (
        <RButton
            variant="default"
            size={size}
            // eslint-disable-next-line react/button-has-type
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={className}
        >
            {icon && (
                <Icon className={`${renderedLabel ? "me-3" : ""}`} icon={icon} size={iconSize || size} />
            )}
            {renderedLabel}
            {loading && (
                <Icon
                    className="align-middle fa-spin ms-3"
                    size={iconSize || size}
                >
                    spinner
                </Icon>
            )}
        </RButton>
    );
};

export default Button;

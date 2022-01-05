import React, { useMemo } from "react";
import { Link } from "react-router-dom";

import FapIcon from "../elements/FapIcon";

const Button = ({
    useButton = true,
    to = "#",
    onClick = undefined,
    variant = "default",
    label = undefined,
    children,
    type = "button",
    className: classAppend = "",
    block = false,
    outline = false,
    bold = false,
    icon = undefined,
    iconSize = undefined,
    disabled = false,
    loading = false,
}) => {
    const className = useMemo(() => {
        let cName = `btn btn-ln ${classAppend}`;

        if (block) {
            cName += " btn-block";
        }

        switch (variant.toLowerCase()) {
            case "cancel":
            case "warn":
                cName += " btn-outline-secondary";
                break;
            case "secondary":
                cName += " btn-secondary";
                break;

            case "icon":
                cName = "btn-icon";
                break;
            default:
                cName += outline ? " btn-outline-primary" : " btn-primary";
                break;
        }

        return cName;
    }, [outline, variant, block, classAppend]);

    const renderedLabel = useMemo(() => {
        const lbl = label || children;

        return bold ? <strong>{lbl}</strong> : lbl;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [label, children]);

    return useButton ? (
        <button
            // eslint-disable-next-line react/button-has-type
            type={type}
            className={className}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <FapIcon className="me-3" icon={icon} size={iconSize} />}
            <span className={`${loading ? "me-5" : ""}`}>{renderedLabel}</span>
            {loading && (
                <FapIcon className="align-middle fa-spin ms-3">spinner</FapIcon>
            )}
        </button>
    ) : (
        <Link to={to} className={className} onClick={onClick}>
            {icon && <FapIcon className="me-3" icon={icon} size={iconSize} />}
            <span className={`${loading ? "me-5" : ""}`}>{renderedLabel}</span>
            {loading && (
                <FapIcon className="align-middle fa-spin ms-3">spinner</FapIcon>
            )}
        </Link>
    );
};

export default Button;

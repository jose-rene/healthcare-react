import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import Icon from "../elements/Icon";

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
                cName += outline? " btn-outline-primary": " btn-primary";
                break;
        }

        return cName;
    }, [outline, variant, block, classAppend]);

    const renderedLabel = useMemo(() => {
            const lbl = label || children;

            return bold? <strong>{lbl}</strong>: `${lbl}`;
    }, [label, children]);

    return useButton ? (
        <button
            // eslint-disable-next-line react/button-has-type
            type={type}
            className={className}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <Icon className="mr-3" icon={icon} size={iconSize}/>}
            {renderedLabel}
        </button>
    ) : (
        <Link to={to} className={className} onClick={onClick}>
            {icon && <Icon className="mr-3" icon={icon} size={iconSize}/>}
            {renderedLabel}
        </Link>
    );
};

export default Button;

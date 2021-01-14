import React from "react";
import {Link} from "react-router-dom";
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
                    icon = undefined,
                    iconSize = undefined,
                    disabled = false,
                }) => {
    let className = `btn btn-ln ${classAppend}`;

    if (block) {
        className += " btn-block";
    }

    switch (variant.toLowerCase()) {
        case "cancel":
        case "warn":
            className += " btn-outline-secondary";
            break;
        case "icon":
            className = "btn-icon";
            break;
        default:
            className += " btn-primary";
            break;
    }

    return useButton ? (
        <button
            // eslint-disable-next-line react/button-has-type
            type={type}
            className={className}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <Icon className="mr-3" icon={icon} size={iconSize}/>}
            {label || children}
        </button>
    ) : (
        <Link to={to} className={className} onClick={onClick}>
            {icon && <Icon className="mr-3" icon={icon} size={iconSize}/>}
            {label || children}
        </Link>
    );
};

export default Button;

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * @link https://fontawesome.com/icons?d=gallery
 * @param icon
 * @param size
 * @param children
 * @param iconType
 * @param className
 * @param spin
 * @param stacked
 * @param stacked_className
 * @param props
 * @returns {JSX.Element}
 */
const FapIcon = ({
    icon = undefined,
    fixedWidth = undefined,
    size = "lg",
    spin = false,
    className = "",
    type = "fal",
    ...props
}) => {
    const name = icon ? icon.toLowerCase().trim() : "check";

    const map = {
        alert: "exclamation-triangle",
        warning: "exclamation-triangle",
        mail: "envelope",
        email: "envelope",
        cancel: "ban",
        settings: "cog",
        loading: "spinner",
        logout: "sign-out",
        delete: "times-circle",
    };

    const mappedIcon = map[name] || name;
    const mappedClass =
        mappedIcon === "spinner" || spin ? "fa-spin align-middle" : className;

    return (
        <FontAwesomeIcon
            icon={[type, mappedIcon]}
            className={mappedClass}
            size={fixedWidth ? null : size}
            fixedWidth
            {...props}
        />
    );
};

FapIcon.displayName = "FapIcon";

export default FapIcon;

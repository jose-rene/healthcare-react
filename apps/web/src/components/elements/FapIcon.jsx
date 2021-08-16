import React from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fal } from "@fortawesome/pro-light-svg-icons";
// @todo should only import icons that are used
library.add(fal);

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
    size = "lg",
    spin = false,
    className = "",
    ...props
}) => {
    const name = icon ? icon.toLowerCase().trim() : "check";

    const map = {
        alert: "exclamation-triangle",
        warning: "exclamation-triangle",
        mail: "envelope",
        email: "envelope",
        cancel: "ban",
        loading: "spinner",
        delete: "times-circle",
    };

    const mappedIcon = map[name] || name;
    const mappedClass =
        mappedIcon === "spinner" || spin ? "fa-spin" : className;

    console.log(`icon class ${mappedClass}`);

    return (
        <FontAwesomeIcon
            icon={["fal", mappedIcon]}
            className={mappedClass}
            size={size}
            {...props}
        />
    );
};

FapIcon.displayName = "FapIcon";

export default FapIcon;

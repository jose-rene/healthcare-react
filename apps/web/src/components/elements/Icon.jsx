import React from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faTrash, faAlert } from '@fortawesome/free-solid-svg-icons'

/**
 * @link https://fontawesome.com/icons?d=gallery
 * @param icon
 * @param size
 * @param children
 * @param iconType
 * @param className
 * @param props
 * @returns {JSX.Element}
 */
const Icon = ({
    icon = undefined,
    size = "2x",
    children,
    iconType = "s",
    className = "",
    ...props
}) => {
    let name = icon || children;
    name = name.toLowerCase().trim();

    const map = {
        alert: "exclamation-triangle",
        mail: "envelope",
        email: "envelope",
        cancel: "ban",
        loading: "spinner",
    };

    const mappedIcon = map[name] || name;
    if (name === "spinner" && !className) {
        className = "fa-spin";
    }

    return (
        <i
            className={`${className} icon fa${iconType} fa-${mappedIcon
                .toLowerCase()
                .trim()} fa-${size}`}
            {...props}
        />
    );
};

Icon.displayName = "Icon";

export default Icon;

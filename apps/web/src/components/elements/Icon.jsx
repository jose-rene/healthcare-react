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
 * @param spin
 * @param stacked
 * @param stacked_className
 * @param props
 * @returns {JSX.Element}
 */
const Icon = ({
    icon = undefined,
    size = "2x",
    children,
    iconType = "s",
    className = "",
    spin = false,
    stacked = false,
    stacked_className = "",
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

    const mainIcon = (
        <i
            className={`${className} icon fa${iconType} fa-${mappedIcon
                .toLowerCase()
                .trim()} ${
                stacked ? "fa-stack-1x" : `fa-${size} ${spin ? "fa-spin" : ""}`
            }`}
            {...props}
        />
    );

    return stacked ? (
        <span className={`fa-stack`}>
            {stacked && (
                <i
                    className={`${stacked_className} fa fa-circle fa-stack-2x`}
                />
            )}
            {mainIcon}
        </span>
    ) : (
        mainIcon
    );
};

Icon.displayName = "Icon";

export default Icon;

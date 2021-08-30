import React, { useMemo } from "react";

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
    const name = (icon || children).toLowerCase().trim();

    // Get the icon class details
    const mappedIcon = useMemo(() => {
        const map = {
        logout: "sign-out-alt",
            alert: "exclamation-triangle",
            mail: "envelope",
            email: "envelope",
            cancel: "ban",
            loading: "spinner",
            delete: "times-circle",
        };

        if (name === "spinner" && !className) {
            className = "fa-spin";
        }

        const iconName = (map[name] || name).toLowerCase().trim();
        return `icon fa${iconType} fa-${iconName} ${className}`;
    }, [name, className]);

    // if the icon is a spinner make sure it has the spin animation
    const spinning = useMemo(() => {
        return spin ? "fa-spin" : "";
    }, [spin]);

    // how large is the icon
    const iconSize = useMemo(() => {
        return stacked ?
            "fa-stack-1x" :
            `fa-${size} ${spinning}`;
    }, [size, spinning, stacked]);

    const mainIcon = (<i className={`${mappedIcon}  ${iconSize}`}{...props} />);

    return stacked ? (
        <span className="fa-stack">
            <i className={`${stacked_className} fa fa-circle fa-stack-2x`} />
            {mainIcon}
        </span>
    ) : (
        mainIcon
    );
};

Icon.displayName = "Icon";

export default Icon;

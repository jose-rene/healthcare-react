import React from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faTrash, faAlert } from '@fortawesome/free-solid-svg-icons'

/**
 * @link https://fontawesome.com/icons?d=gallery
 * @param icon
 * @param size
 * @param children
 * @param props
 * @returns {JSX.Element}
 */
export default ({icon = undefined, size="2x", children, ...props}) => {
    let _icon = icon || children;
    _icon = _icon.toLowerCase().trim();

    // Image Overrides
    // switch(_icon){
    //     case "download":
    //         return <img src="/images/icons/download.png" alt="download icon" />;
    // }

    const icon_map = {
        alert: 'exclamation-triangle',
    };

    const mappedIcon = icon_map[_icon] || _icon;

    return <i className={`icon fas fa-${mappedIcon.toLowerCase().trim()} fa-${size}`} {...props}/>;
}

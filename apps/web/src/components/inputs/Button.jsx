import React from "react";
import {Link} from "react-router-dom";

export default ({useButton=true, to="#", onClick=undefined, variant = 'default', label=undefined, children, type="button", className: classAppend = '', block = false}) => {
    let className = `btn btn-ln ${classAppend}`;

    if(block){
        className += " btn-block";
    }

    switch (variant.toLowerCase()){
        case "cancel":
        case "warn":
            className += ' btn-outline-secondary';
            break;
        case "primary":
            className += ' btn-primary';
            break;
        case "icon":
            className = "btn-icon";
    }

    return useButton?
        <button type={type} className={className} onClick={onClick}>
            {label || children}
        </button>:
        <Link to={to} className={className} onClick={onClick}>
            {label || children}
        </Link>;
}

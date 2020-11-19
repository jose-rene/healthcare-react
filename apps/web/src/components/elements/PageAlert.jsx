import React, {useEffect, useState} from "react";
import {Alert} from "react-bootstrap";
import Icon from "./Icon";
import "../../styles/PageAlert.scss";

/**
 * @link https://fontawesome.com/icons?d=gallery
 * @param variant [ 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
 * @param children
 * @param show
 * @param dismissible
 * @param icon
 * @param onClose
 * @returns {JSX.Element}
 */
export default ({variant = 'error', children, show = true, dismissible = false, icon = 'alert', onClose = () => null}) => {
    const [_show, set_show] = useState(show);

    useEffect(() => {
        set_show(show);
    }, [show]);

    const handleOnClose = () => {
        set_show(false);
        onClose();
    }


    return _show? (
        <Alert variant={variant} show={show} dismissible={dismissible} onClose={handleOnClose} >
            {icon && (
                <Icon alt={`alert-icon-${variant}`} icon={icon} />
            )}
            <p>
                {children}
            </p>
        </Alert>
    ): null;
}

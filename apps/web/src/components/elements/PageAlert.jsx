import React, { useEffect, useRef, useState } from "react";
import { Alert } from "react-bootstrap";
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
const PageAlert = ({
    variant = "error",
    children,
    show = true,
    dismissible = false,
    icon = "alert",
    timeout = 0,
    onClose = () => null,
}) => {
    const [_show, setShow] = useState(show);
    const timeoutSet = useRef(null);

    useEffect(() => {
        setShow(show);
        if (show && timeout) {
            timeoutSet.current = setTimeout(() => {
                setShow(false);
            }, timeout);
        }
    }, [show]);

    const handleOnClose = () => {
        if (timeoutSet.current) {
            clearTimeout(timeoutSet.current);
            timeoutSet.current = null;
        }
        setShow(false);
        onClose();
    };

    return _show ? (
        <Alert
            variant={variant}
            show={show}
            dismissible={dismissible}
            onClose={handleOnClose}
        >
            {icon && <Icon alt={`alert-icon-${variant}`} icon={icon} />}
            <p>{children}</p>
        </Alert>
    ) : null;
};

export default PageAlert;

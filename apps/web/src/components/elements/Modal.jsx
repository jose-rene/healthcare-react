import React from "react";
import { Modal as B_MODAL } from "react-bootstrap";
import Icon from "./Icon";

const Modal = ({
    show = false,
    onHide,
    size = "md",
    title,
    titleIcon,
    children,
    hasClose = false,
    dialogClassName = undefined,
    ...otherProps
}) => {
    return (
        <B_MODAL
            size={size}
            show={show}
            onHide={onHide}
            dialogClassName={dialogClassName}
            backdropClassName={`${dialogClassName}-backdrop`}
            {...otherProps}
        >
            {title && (
                <B_MODAL.Header closeButton={hasClose}>
                    <B_MODAL.Title>
                        {titleIcon ? (
                            <Icon icon={titleIcon} size="lg" className="me-2" />
                        ) : null}
                        {title}
                    </B_MODAL.Title>
                </B_MODAL.Header>
            )}
            <B_MODAL.Body>{children}</B_MODAL.Body>
        </B_MODAL>
    );
};

export default Modal;

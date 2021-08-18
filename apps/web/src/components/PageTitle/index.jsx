import React from "react";
import Icon from "../elements/Icon";

const PageTitle = ({
    title,
    hideBack = false,
    backLabel = "Back",
    onBack,
    children,
    actions = [],
}) => {
    return (
        <div className="row d-flex justify-content-start align-content-center p-3 ps-0">
            <div className="d-flex">
                {!hideBack && (
                    <span
                        className="text-dark text-decoration-none me-3 pt-2"
                        onClick={onBack}
                    >
                        <Icon
                            icon="chevron-left"
                            size="small"
                            className="me-2"
                        />
                        {backLabel}
                    </span>
                )}

                {children}

                {title && (
                    <div className={`box-title ${!hideBack ? "ms-4" : ""}`}>
                        {title}
                    </div>
                )}

                {actions.map((a) => (
                    <span
                        className="text-dark text-decoration-none ms-3 pt-2"
                        onClick={a.onClick}
                    >
                        {a.icon && (
                            <Icon icon={a.icon} size="small" className="me-2" />
                        )}
                        {a.label}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default PageTitle;

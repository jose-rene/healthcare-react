import React from "react";
import { Button } from "react-bootstrap";
import FapIcon from "../elements/FapIcon";

const PageTitle = ({
    title,
    hideBack = false,
    backLabel = "Back",
    backLink,
    onBack,
    children,
    actions = [],
}) => {
    return (
        <div className="d-flex mb-4">
            {!hideBack && (
                <Button
                    variant="link"
                    className="px-0 pb-1 me-4"
                    onClick={onBack}
                    href={backLink}
                >
                    <FapIcon icon="chevron-left" />
                    {backLabel}
                </Button>
            )}

            {children}

            {title && <h2 className="py-0 m-0">{title}</h2>}

            {actions.map((a, i) => (
                <Button
                    key={i}
                    variant="link"
                    className="pb-0 pt-2 ms-2"
                    onClick={a.onClick}
                    href={a.href ?? null}
                >
                    {a.icon && <FapIcon icon={a.icon} />}
                    {a.label}
                </Button>
            ))}
        </div>
    );
};

export default PageTitle;

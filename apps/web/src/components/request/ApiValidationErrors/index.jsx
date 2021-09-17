import React, { useMemo } from "react";

const ApiValidationErrors = ({ errors }) => {
    const messages = useMemo(() => {
        const rtv = [];

        Object.keys(errors).forEach((k) => {
            rtv.push({
                name: k,
                notes: errors[k],
            });
        });

        return rtv;
    }, [errors]);

    if (messages.length === 0) {
        return null;
    }

    return (
        <ul className="list-unstyled">
            {messages.map(({ notes }) => (
                <li className="text-danger">{notes.join(" and ")}</li>
            ))}
        </ul>
    );
};

export default ApiValidationErrors;

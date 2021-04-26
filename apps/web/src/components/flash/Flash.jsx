import React, { useEffect, useState } from "react";

import "./Flash.css";

const Flash = ({ message, type }) => {
    // type : 'success', 'error'
    const [visibility, setVisibility] = useState(false);

    useEffect(() => {
        if (document.querySelector(".flash-close") !== null) {
            document
                .querySelector(".flash-close")
                .addEventListener("click", () => setVisibility(false));
        }
    });

    useEffect(() => {
        if (message) {
            setVisibility(true);
            setTimeout(() => {
                setVisibility(false);
            }, 4000);
        }
    }, [message, type, setVisibility]);

    return (
        visibility && (
            <div className={`flash flash-${type}`}>
                <span className="flash-close">
                    <strong>X</strong>
                </span>
                <p>{message}</p>
            </div>
        )
    );
};

export default Flash;

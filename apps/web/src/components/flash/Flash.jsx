import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";

import "./Flash.css";

const Flash = () => {
    // type : 'success', 'error'
    const [visibility, setVisibility] = useState(false);

    const location = useLocation();
    const history = useHistory();

    const { message, type } = location?.state || {};

    const clearState = () => {
        setVisibility(false);
        delete location.state;

        history.replace(location);
    };

    useEffect(() => {
        if (document.querySelector(".flash-close") !== null) {
            document
                .querySelector(".flash-close")
                .addEventListener("click", () => {
                    clearState();
                });
        }
    });

    useEffect(() => {
        if (message) {
            setVisibility(true);
            setTimeout(() => {
                clearState();
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

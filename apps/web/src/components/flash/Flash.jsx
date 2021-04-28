import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useLocation, useHistory } from "react-router-dom";

const Flash = () => {
    const location = useLocation();
    const history = useHistory();

    const { message, type } = location?.state || {};

    const notify = (type) => {
        switch (type) {
            case "success":
                toast.success(message);
                return;

            case "error":
                toast.error(message);
                return;

            case "info":
                toast.info(message);
                return;

            case "warning":
                toast.warning(message);
                return;

            case "dark":
                toast.dark(message);
                return;

            default:
                toast(message);
        }
    };

    const clearState = () => {
        delete location.state;

        history.replace(location);
    };

    useEffect(() => {
        if (message) {
            notify(type);
            clearState();
        }
    }, [message, type]);

    return (
        <div>
            <ToastContainer />
        </div>
    );
};

export default Flash;

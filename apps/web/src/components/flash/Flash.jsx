import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Flash = () => {
    return (
        <div>
            <ToastContainer
                timeout={500}
                position="bottom-right"
                pauseOnHover
            />
        </div>
    );
};

export default Flash;

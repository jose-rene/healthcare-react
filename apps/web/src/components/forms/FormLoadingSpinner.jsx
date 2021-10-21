import React from "react";
import { Spinner } from "react-bootstrap";

const FormLoadingSpinner = ({ loading = true }) => {
    return (
            <div className="d-flex align-items-center align-content-center justify-content-center p-5">
                {loading && <Spinner animation="border" />}
            </div>
    );
};

export default FormLoadingSpinner;

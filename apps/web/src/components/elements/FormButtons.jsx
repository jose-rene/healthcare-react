import React from "react";
import Button from "../inputs/Button";

const FormButtons = ({ submitLabel = "Submit", onCancel = () => {} }) => {
    return (
        <div className="form-row">
            <div className="col-md-5">
                <Button
                    className="btn btn-block"
                    variant="secondary"
                    onClick={() => onCancel()}
                >
                    Cancel
                </Button>
            </div>

            <div className="col-md-5">
                <Button className="btn btn-block" type="Submit">
                    {submitLabel}
                </Button>
            </div>
        </div>
    );
};

export default FormButtons;

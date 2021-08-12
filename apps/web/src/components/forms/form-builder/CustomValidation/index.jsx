import React from "react";
import Textarea from "../../../inputs/Textarea";

const CustomValidation = ({
    element,
    name = "customValidation",
    updateElement,
    eventKey,
    ...props
}) => {
    const { props: { [name]: customValidation = "" } = "" } = element || {};

    return (
        <Textarea
            label="Custom Validation"
            value={customValidation}
            name="customValidation"
            rows={5}
            helpText={
                <a
                    href="https://lodash.com/docs/4.17.15#template"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Template help
                </a>
            }
            {...props}
        />
    );
};

export default CustomValidation;

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
            helpText="If condition is not falsy then output the text as a red validation error. Variables
            must start with ~ for example ~first_name"
            {...props}
        />
    );
};

export default CustomValidation;

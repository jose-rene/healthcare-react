import React from "react";
import ContextInput from "../ContextInput";

const ZipcodeInput = ({
    name = "postal_code",
    label = "Zip*",
    placeholder = "99999",
    ...props
}) => {
    props.mask = placeholder;

    return (
        <ContextInput
            name={name}
            label={label}
            {...props}
        />
    );
};

export default ZipcodeInput;

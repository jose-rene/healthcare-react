import React from "react";
import { useFormContext } from "../../../Context/FormContext";
import { Input } from "../../index";

const ContextInput = ({ name, customRule, ...props }) => {
    const { getValue, onChange, getError, editing, shouldShow, autocomplete } =
        useFormContext();

    if (autocomplete) {
        props.autocomplete = autocomplete === false ? "off" : autocomplete;
    }

    if (!editing && customRule && !shouldShow(customRule)) {
        return null;
    }

    const value = getValue(name);
    const errorMessage = getError({ name });

    props.value = value;
    props.onChange = onChange;

    if (errorMessage) {
        props.error = errorMessage;
    }

    return <Input name={name} {...props} />;
};

export default ContextInput;

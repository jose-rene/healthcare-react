import React from "react";
import { useFormContext } from "Context/FormContext";
import { Input } from "components";

const ContextInput = ({ name, rowIndex = 0, customRule, ...props }) => {
    const { getValue, onChange, getError, editing, autocomplete } =
        useFormContext();
    const value = getValue(name);
    const errorMessage = getError({ name });
    props.value = value;
    props.onChange = onChange;

    if (autocomplete) {
        props.autocomplete = autocomplete === false ? "off" : autocomplete;
    }

    if (errorMessage) {
        props.error = errorMessage;
    }

    return <Input name={name} {...props} className={editing ? "mt-3 form-control" : "form-control"} />;
};

export default ContextInput;

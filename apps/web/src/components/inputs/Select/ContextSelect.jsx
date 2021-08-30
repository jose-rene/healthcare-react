import React from "react";
import { useFormContext } from "../../../Context/FormContext";
import Select from "./index";

const ContextSelect = ({ name, ...otherProps }) => {
    const { getValue, getError, onChange } = useFormContext();

    otherProps.name = name;
    otherProps.onChange = onChange;
    otherProps.value = getValue(name);
    otherProps.errors = { [name]: { message: getError({ name }) } };

    return <Select {...otherProps} />;
};

export default ContextSelect;

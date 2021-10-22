import React from "react";
import SelectWithFilter from "./index";
import { useFormContext } from "../../../Context/FormContext";

const CTXSelectWithFilter = ({ name, onChange: _onChange = false, ...props }) => {
    const { getValue, getError, update } = useFormContext();
    const value = getValue(name);

    props.name = name;
    props.value = value;
    props.error = getError({ name });

    props.onChange = e => {
        const {
            value: tValue = "",
        } = e.target;

        update(name, tValue);

        _onChange && _onChange(e);
    };

    return <SelectWithFilter {...props} />;
};

export default CTXSelectWithFilter;

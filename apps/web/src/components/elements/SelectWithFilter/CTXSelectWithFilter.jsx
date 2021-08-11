import React from "react";
import SelectWithFilter from "./index";
import { useFormContext } from "../../../Context/FormContext";

const CTXSelectWithFilter = ({ name, onChange: _onChange = false, ...props }) => {
    const { form, setForm, getError } = useFormContext();
    const { [name]: value } = form;

    props.name = name;
    props.value = value;
    props.error = getError(name);

    props.onChange = e => {
        //props.debug && console.log('props.onChange', { e });
        setForm({ ...form, [name]: e.target.value || '' });

        _onChange && _onChange(e);
    };

    return <SelectWithFilter {...props} />;
};

export default CTXSelectWithFilter;

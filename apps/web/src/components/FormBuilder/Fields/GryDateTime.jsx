import React from "react";
import ContextInput from "../../inputs/ContextInput";

const GryDateTime = (props) => {
    const allProps = {
        ...(props.data ?? {}),
        ...props,
    };

    const { custom_name, ...rest } = allProps;

    if (!custom_name) {
        return <p>Missing custom_name</p>;
    }

    return (
        <ContextInput
            type="datetime-local"
            autoComplete="off"
            {...{ ...rest, name: custom_name }}
        />
    );
};

GryDateTime.register = {
    // icon: 'fa fa-keyboard',
    // element: 'bare',
    icon: "fas fa-time",
    name: "Datetime Input",
    static: true,
    label: "Date Input",
    props: {
        custom_name: "field_name_here",

        customValidation: "",

        customRules: "",
    },
};

export default GryDateTime;

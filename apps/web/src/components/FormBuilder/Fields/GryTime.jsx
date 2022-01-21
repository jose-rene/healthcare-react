import React from "react";
import ContextInput from "../../inputs/ContextInput";

const GryTime = (props) => {
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
            type="time"
            autoComplete="off"
            {...{ ...rest, name: custom_name }}
        />
    );
};

GryTime.register = {
    // icon: 'fa fa-keyboard',
    // element: 'bare',
    icon: "fas fa-clock",
    name: "Time Input",
    static: true,
    label: "Time Input",
    props: {
        custom_name: "field_name_here",

        customValidation: "",

        customRules: "",
    },
};

export default GryTime;

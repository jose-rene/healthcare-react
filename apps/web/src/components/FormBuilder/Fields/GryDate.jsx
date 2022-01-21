import React from "react";
import ContextInput from "../../inputs/ContextInput";

const GryDate = (props) => {
    const allProps = {
        ...(props.data ?? {}),
        ...props,
    };

    const { custom_name, ...rest } = allProps;

    if (!custom_name) {
        return <p>Missing custom_name</p>;
    }

    const style = {
        width: "unset !important",
    };

    return (
        <ContextInput
            type="date"
            autoComplete="off"
            {...{ ...rest, name: custom_name, style }}
        />
    );
};

GryDate.register = {
    // icon: 'fa fa-keyboard',
    // element: 'bare',
    icon: "fas fa-calendar",
    name: "Date Input",
    static: true,
    label: "Date Input",
    props: {
        custom_name: "field_name_here",

        customValidation: "",

        customRules: "",
    },
};

export default GryDate;

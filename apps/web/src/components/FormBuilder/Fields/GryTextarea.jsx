import React from "react";
import ContextInput from "../../inputs/ContextInput";

const GryTextarea = (props) => {
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
            type="textarea"
            autoComplete="off"
            {...{ ...rest, name: custom_name }}
        />
    );
};

GryTextarea.register = {
    // icon: 'fa fa-keyboard',
    // element: 'bare',
    icon: "fas fa-paragraph",
    name: "Input Textarea",
    static: true,
    label: "Input Textarea",
    props: {
        custom_name: "field_name_here",

        customValidation: "",

        customRules: "",
    },
};

export default GryTextarea;

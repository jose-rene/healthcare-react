import React from "react";
import ContextInput from "../../inputs/ContextInput";

const GryInput = (props) => {
    const allProps = {
        ...(props.data ?? {}),
        ...props,
    };

    const { custom_name, ...rest } = allProps;

    if (!custom_name) {
        return <p>Missing custom_name</p>;
    }

    return (
        <ContextInput autoComplete="off" {...{ ...rest, name: custom_name }} />
    );
};

GryInput.register = {
    // icon: 'fa fa-keyboard',
    // element: 'bare',
    icon: "fas fa-font",
    name: "Input Text Custom",
    static: true,
    label: "Input Text Custom",
    props: {
        custom_name: "Field Name Here",

        customValidation: ``,

        customRules: ``,
    },
};

export default GryInput;

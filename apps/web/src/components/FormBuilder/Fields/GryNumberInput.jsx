import React from "react";
import ContextInput from "../../inputs/ContextInput";

const GryNumberInput = (props) => {
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
            type="number"
            autoComplete="off"
            {...{ ...rest, name: custom_name }}
        />
    );
};

GryNumberInput.register = {
    icon: "fas fa-hashtag",
    name: "Input Number",
    static: true,
    label: "Input Number",
    props: {
        custom_name: "field_name_here",

        customValidation: "",

        customRules: "",

        type: "number",
        step: "1",
        max: "10000",
        min: "0",
    },
};

export default GryNumberInput;

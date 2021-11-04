import React from "react";
import ContextCheckbox from "../../inputs/Checkbox/ContextCheckbox";

const GryCheckbox = (props) => {
    const allProps = {
        ...(props.data ?? {}),
        ...props,
    };

    const { custom_name, ...rest } = allProps;

    if (!custom_name) {
        return <p>Missing custom_name</p>;
    }

    return (
        <ContextCheckbox
            {...{ ...rest, name: custom_name }}
        />
    );
};

GryCheckbox.register = {
    icon: "fas fa-check-square",
    name: "checkbox",
    label: "Checkbox",
    props: {
        custom_name: "checkbox",
        customValidation: ``,
        customRules: ``,
    },
};

export default GryCheckbox;

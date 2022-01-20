import React from "react";
import CtxCheckboxGroup from "../../inputs/CtxCheckboxGroup";

const GryCheckboxGroup = (props) => {
    const allProps = {
        ...(props.data ?? {}),
        ...props,
    };

    const { custom_name, ...rest } = allProps;

    if (!custom_name) {
        return <p>Missing custom_name</p>;
    }

    return <CtxCheckboxGroup {...{ ...rest, name: custom_name }} />;
};

GryCheckboxGroup.register = {
    icon: "fas fa-check-square",
    name: "Checkbox Group",
    label: "Group of checkboxes",
    options: [{ value: "welcome", text: "welcome" }],
    props: {
        custom_name: "checkbox_group",
        customValidation: "",
        customRules: "",
    },
};

export default GryCheckboxGroup;

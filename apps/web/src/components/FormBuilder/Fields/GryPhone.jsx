import React from "react";
import ContextInput from "../../inputs/ContextInput";

const GryPhone = (props) => {
    const allProps = {
        ...(props.data ?? false),
        ...props.data,
    };

    allProps.name = allProps.custom_name;

    return (
        <ContextInput
            label="phone"
            placeholder="(000) 000-0000"
            {...allProps}
        />
    );
};

GryPhone.register = {
    icon: "fas fa-phone",
    name: "Input Phone",
    custom_name: "phone",
    static: true,
    label: "Input Phone",
    props: {
        custom_name: "phone",
        customValidation: ``,
        customRules: ``,
    },
};

export default GryPhone;

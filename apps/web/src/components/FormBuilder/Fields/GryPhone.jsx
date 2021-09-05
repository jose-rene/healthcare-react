import React from "react";
import PhoneInput from "../../inputs/PhoneInput";

const GryPhone = (props) => {
    const allProps = {
        ...props,
        ...(props.data ?? {}),
    };

    const { custom_name = "phone" } = allProps;

    return (
        <PhoneInput
            label="phone"
            name={custom_name}
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

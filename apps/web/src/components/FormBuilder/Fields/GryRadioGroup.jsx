import React from "react";
import ContextRadioInput from "../../inputs/ContextRadioInput";
import { useFormContext } from "../../../Context/FormContext";

const GryRadioGroup = (props) => {
    const { onChange, getValue, editing, shouldShow } = useFormContext();

    const allProps = {
        ...(props.data ?? {}),
        ...props,
    };

    const {
        custom_name,
        options = [],
        rowIndex = 0,
        customRule,
        ...rest
    } = allProps;

    if (!custom_name) {
        return <p>Missing custom_name</p>;
    }

    if (
        !editing &&
        customRule &&
        !shouldShow(customRule, { custom_name, rowIndex })
    ) {
        return null;
    }

    const value = getValue(custom_name);

    return (
        <>
            {options.map((radio) => (
                <ContextRadioInput
                    {...{ ...rest, name: custom_name }}
                    label={radio.text}
                    value={radio.value}
                    onChange={onChange}
                    checked={value === radio.value}
                />
            ))}
        </>
    );
};

GryRadioGroup.register = {
    icon: "fas fa-radio-square",
    name: "Radio Group",
    label: "Group of radios",
    options: [{ value: "welcome", text: "welcome" }],
    props: {
        custom_name: "radio-group",
        customValidation: ``,
        customRules: ``,
    },
};

export default GryRadioGroup;

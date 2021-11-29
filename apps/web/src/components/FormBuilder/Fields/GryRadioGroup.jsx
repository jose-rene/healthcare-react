import React from "react";
import ContextRadioInput from "../../inputs/ContextRadioInput";
import { useFormContext } from "../../../Context/FormContext";

const GryRadioGroup = (props) => {
    const { onChange, getValue } = useFormContext();

    const allProps = {
        ...(props.data ?? {}),
        ...props,
    };

    const {
        label = null,
        custom_name,
        options = [],
        customRule,
        inline = false,
        ...rest
    } = allProps;

    if (!custom_name) {
        return <p>Missing custom_name</p>;
    }

    const value = getValue(custom_name);

    return (
        <div className="clearfix">
            <label
                htmlFor={`_${custom_name}`}
                className={inline ? "float-start" : ""}
            >
                {label}
            </label>
            <div
                id={`_${custom_name}`}
                className={inline ? "float-start ps-3" : ""}
            >
                {options.map((radio) => (
                    <ContextRadioInput
                        {...{ ...rest, name: custom_name }}
                        inline={inline}
                        label={radio.text}
                        value={radio.value}
                        onChange={onChange}
                        checked={value === radio.value}
                    />
                ))}
            </div>
        </div>
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
        inline: false,
    },
};

export default GryRadioGroup;

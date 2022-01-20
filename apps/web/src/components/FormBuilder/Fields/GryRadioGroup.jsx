import React from "react";
import ContextRadioInput from "../../inputs/ContextRadioInput";
import { useFormContext } from "../../../Context/FormContext";

const GryRadioGroup = (props) => {
    const { onChange, getValue, getError } = useFormContext();

    const allProps = {
        ...(props.data ?? {}),
        ...props,
    };

    const {
        label = null,
        custom_name: name,
        options = [],
        customRule,
        inline = false,
        ...rest
    } = allProps;

    const error = getError({ name });

    if (!name) {
        return <p>Missing custom_name</p>;
    }

    const value = getValue(name);

    return (
        <div className="clearfix my-3">
            <label htmlFor={`_${name}`} className={inline ? "float-start" : ""}>
                {label}
            </label>
            <div
                id={`_${name}`}
                className={`${error ? "is-invalid" : ""} ${
                    inline ? "float-start ps-3" : ""
                }`}
            >
                {options.map((radio, index) => (
                    <ContextRadioInput
                        {...{ ...rest, name }}
                        inline={inline}
                        label={radio.text}
                        value={radio.value}
                        onChange={onChange}
                        checked={value === radio.value}
                        labelRight
                        key={`${name}-radio-${index}`}
                    />
                ))}
            </div>
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
};

GryRadioGroup.register = {
    icon: "fas fa-radio-square",
    name: "Radio Group",
    label: "Group of radios",
    inline: false,
    options: [{ value: "welcome", text: "welcome" }],
    props: {
        custom_name: "radio_group",
        customValidation: "",
        customRules: "",
        inline: false,
    },
};

export default GryRadioGroup;

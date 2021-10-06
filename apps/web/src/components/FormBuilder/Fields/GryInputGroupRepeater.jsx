import React from "react";
import { useFormContext } from "../../../Context/FormContext";
import { Button } from "components/index";

// placeholder this component is controlled/ rendered in the react-form-2 package.
const GryInputGroupRepeater = () => null;

export const DuplicateButton = (props = {}) => {
    const { editing } = useFormContext();

    if (editing) {
        return null;
    }

    return <Button label="+" title={"Duplicate section"} {...props} />;
};

GryInputGroupRepeater.register = {
    element: "OneColumnRow",
    name: "Input Group Repeater",
    custom_name: "group",
    isContainer: true,
    static: false,
    canHaveAnswer: false,
    canHaveSpanSettings: true,
    label: "",
    icon: "fas fa-columns",
    span_width: 12,

    buttons: [
        <DuplicateButton />,
    ],

    props: {
        custom_name: "group",
        customValidation: ``,
        customRules: ``,
        span_width: 12,
    },
};

export default GryInputGroupRepeater;

import React from "react";
import { useFormContext } from "../../../Context/FormContext";
import { template } from "../../../helpers/string";

const GryText = (props) => {
    const { label: defaultLabel = "" } = props.data || {};
    const { label: __html = defaultLabel } = props;
    const { form } = useFormContext();

    const label = __html || defaultLabel;
    const outputTemplate = template(label, form);

    return <div dangerouslySetInnerHTML={{ __html: outputTemplate }} />;
};

GryText.register = {
    icon: "fas fa-align-justify",
    name: "Text Output",
    label: "Text to output",
    props: {
        custom_name: "field_name_here",

        customValidation: "",

        customRules: "",
    },
};

export default GryText;

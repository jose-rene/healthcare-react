import React from 'react';
import { useFormContext } from "../../../Context/FormContext";
import { template } from "../../../helpers/string";

const GryText = ({ customRule, data: { label: __html } = {} }) => {
    const { form, editing, shouldShow } = useFormContext();

    if (!editing && customRule && !shouldShow(customRule)) {
        return null;
    }

    const outputTemplate = template(__html, form);

    return (
        <div dangerouslySetInnerHTML={{ __html: outputTemplate }} />
    );
};

GryText.register = {
    icon: 'fas fa-align-justify',
    name: 'Text Output',
    label: 'Text to output',
    props: {
        custom_name: 'text-output',

        customValidation: ``,

        customRules: ``,
    },
};

export default GryText;

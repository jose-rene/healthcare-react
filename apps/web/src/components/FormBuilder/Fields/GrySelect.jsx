import React from "react";
import CTXSelectWithFilter from "../../elements/SelectWithFilter/CTXSelectWithFilter";

const GrySelect = (props) => {
    const allProps = {
        ...(props.data ?? {}),
        ...props,
    };

    const { custom_name, ...rest } = allProps;

    if (!custom_name) {
        return <p>Missing custom_name</p>;
    }

    return (
        <div className="mb-3">
            <CTXSelectWithFilter
                {...{ ...rest, name: custom_name }}
            />
        </div>
    );
};

GrySelect.register = {
    icon: 'fas fa-boxes',
    name: 'Select',
    label: 'Select',
    options: [
        { value: 'welcome', text: 'welcome' },
    ],
    props: {
        custom_name: 'select',
        customValidation: ``,
        customRules: ``,
    },
};

export default GrySelect;

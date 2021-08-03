import React from 'react';
import CTXSelectWithFilter from "../../elements/SelectWithFilter/CTXSelectWithFilter";

const GrySelect = (props) => {
    const allProps = {
        ...props.data.props,
        //...props,
        ...props.data,
    };

    return (
        <CTXSelectWithFilter
            {...allProps}
        />
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

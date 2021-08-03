import React from 'react';
import CtxCheckboxGroup from "../../inputs/CtxCheckboxGroup";

const GryCheckboxGroup = (props) => {
    const allProps = {
        ...props.data.props,
        //...props,
        ...props.data,
    };

    return (
        <CtxCheckboxGroup
            {...allProps}
        />
    );
};

GryCheckboxGroup.register = {
    icon: 'fas fa-check-square',
    name: 'Checkbox Group',
    label: 'Group of checkboxes',
    options: [
        { value: 'welcome', text: 'welcome' },
    ],
    props: {
        custom_name: 'checkbox-group',
        customValidation: ``,
        customRules: ``,
    },
};

export default GryCheckboxGroup;

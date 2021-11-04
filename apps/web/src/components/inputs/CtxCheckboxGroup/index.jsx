import React, { useMemo } from "react";
import CheckBoxGroup from "../CheckBoxGroup";
import { useFormContext } from "../../../Context/FormContext";

const CtxCheckboxGroup = ({
    name,
    rowIndex = 0,
    children,
    customRule,
    options: _options = [],
    ...props
}) => {
    const { getValue, editing, shouldShow, update } = useFormContext();
    const values = getValue(name, []);

    const options = useMemo(() => {
        return _options.map(({ text, label, ...otherOptionProps }) => ({
            label: text || label,
            text,
            ...otherOptionProps,
        }));
    }, [_options]);

    if (!editing && customRule && !shouldShow(customRule, { name, rowIndex })) {
        return null;
    }

    const handleOnChange = ({ target: { name: fieldName, checked } }) => {
        update(fieldName, checked);
    };

    return (
        <CheckBoxGroup
            checked={values}
            name={name}
            options={options}
            {...props}
            onChange={handleOnChange}
        />
    );
};

export default CtxCheckboxGroup;

import React, { useMemo } from "react";
import CheckBoxGroup from "../CheckBoxGroup";
import { useFormContext } from "../../../Context/FormContext";

const CtxCheckboxGroup = ({
    name,
    children,
    customRule,
    options: _options = [],
    ...props
}) => {
    const { form, getValue, editing, shouldShow, update } = useFormContext();

    const options = useMemo(() => {
        return _options.map(({ text, label, ...otherOptionProps }) => ({
            label: text || label,
            text,
            ...otherOptionProps,
        }));
    }, [_options]);

    if (!editing && customRule && !shouldShow(customRule)) {
        return null;
    }

    const values = getValue(name, []);

    const handleOnChange = ({ target: { name: fieldName, checked } }) => {
        update({ [fieldName]: checked });
    };

    return (
        <CheckBoxGroup
            value={values}
            name={name}
            options={options}
            {...props}
            onChange={handleOnChange}
        />
    );
};

export default CtxCheckboxGroup;

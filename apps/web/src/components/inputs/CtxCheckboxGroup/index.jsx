import React, { useMemo } from "react";
import CheckBoxGroup from "../CheckBoxGroup";
import { useFormContext } from "../../../Context/FormContext";

const CtxCheckboxGroup = ({
    name,
    rowIndex = 0,
    children,
    options: _options = [],
    type = "checkbox",
    label = null,
    ...props
}) => {
    const { getValue, getError, update } = useFormContext();
    const values = getValue(name, []);
    const error = getError({ name });

    const options = useMemo(() => {
        return _options.map(({ text, label, ...otherOptionProps }) => ({
            label: text || label,
            text,
            ...otherOptionProps,
        }));
    }, [_options]);

    const handleOnChange = ({ target: { name: fieldName, checked } }) => {
        update(fieldName, checked);
    };

    return (
        <>
            {label && <div>{label}</div>}
            <CheckBoxGroup
                checked={values}
                name={name}
                options={options}
                type={type}
                {...props}
                onChange={handleOnChange}
                hasError={!!error}
            />
            {error && <div className="text-danger mb-3 mt-0 invalid-feedback d-block">{error}</div>}
        </>
    );
};

export default CtxCheckboxGroup;

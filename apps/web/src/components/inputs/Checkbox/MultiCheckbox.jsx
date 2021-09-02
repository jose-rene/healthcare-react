import React from "react";
import Checkbox from "./index";
import { useFormContext } from "../../../Context/FormContext";

const MultiCheckbox = ({ values = [], name, ...props }) => {
    const { getValue, getError, update } = useFormContext();

    const checked = getValue(name, []);
    const error = getError({ name });

    const handleOnChange = ({ target: { name, value, checked: isChecked } }) => {
        const newChecked = [...checked];

        if (!isChecked) {
            if (newChecked.includes(value)) {
                const index = newChecked.findIndex(c => c == value);
                if (index >= 0) {
                    newChecked.splice(index, 1);
                    update(name, newChecked);
                }
            }

            return true;
        }

        if (!newChecked.includes(value)) {
            newChecked.push(value);
            update(name, newChecked);
        }
    };

    return (
        <>
            {values.map(value => {
                return (
                    <Checkbox
                        {...props}
                        label={value.label || value.value}
                        checked={checked.includes(value.value)}
                        value={value.value}
                        name={name}
                        onChange={handleOnChange}
                    />
                );
            })}
            {error && <p>Some eer</p>}
        </>
    );
};

export default MultiCheckbox;

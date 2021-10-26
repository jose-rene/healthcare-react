import React from "react";
import Checkbox from "./index";
import { useFormContext } from "../../../Context/FormContext";

const ContextCheckbox = (props) => {
    const { onChange: propsOnChange, name, value: valueLabel = true } = props;

    const { getValue, getError, update, form } = useFormContext();
    const checked = getValue(name);

    const handleOnChange = (e) => {
        if (propsOnChange) {
            return propsOnChange(e);
        }

        const {
            target: { checked },
        } = e;

        update(name, !!checked);
    };

    return (
        <Checkbox
            {...props}
            checked={checked}
            onChange={handleOnChange}
            errors={{ [name]: { message: getError({ name }) } }}
            value={valueLabel}
        />
    );
};

export default ContextCheckbox;

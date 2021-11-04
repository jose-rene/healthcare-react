import React from "react";
import Checkbox from "./index";
import { useFormContext } from "../../../Context/FormContext";

const ContextCheckbox = (props) => {
    const { onChange: propsOnChange, name, value: valueLabel = true } = props;

    const { getValue, getError, update, shouldShow, editing } = useFormContext();
    const checked = getValue(name);

    const {
        rowIndex,
        customRule,
    } = props;

    const handleOnChange = (e) => {
        if (propsOnChange) {
            return propsOnChange(e);
        }

        const {
            target: { checked },
        } = e;

        update(name, !!checked);
    };

    if (!editing && customRule && !shouldShow(customRule, { name, rowIndex })) {
        return null;
    }

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

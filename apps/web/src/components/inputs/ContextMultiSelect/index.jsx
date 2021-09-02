import React from "react";
import MultiSelect from "react-select";
import { useFormContext } from "../../../Context/FormContext";

const ContextMultiSelect = ({
    name,
    label,
    isMulti = true,
    options = [],
    closeMenuOnSelect = false,
}) => {
    const { getValue, update } = useFormContext();
    const value = getValue(name, []);

    const handleOnChange = (values = []) => {
        update({ [name]: values });
    };

    return (
        <div className="form-group">
            {label && <label className="form-label">{label}</label>}
            <MultiSelect
                closeMenuOnSelect={closeMenuOnSelect}
                isMulti={isMulti}
                placeholder=" "
                options={options}
                value={value}
                onChange={handleOnChange}
            />
        </div>
    );
};

export default ContextMultiSelect;

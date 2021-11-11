import React from "react";
import Checkbox from "../Checkbox";

const CheckBoxGroup = ({ options = false, name, onChange, checked = false, type = "checkbox" }) => {
    return (
        <div>
            {options.map(({ text, label, value, children, ...opt }) => {
                return (
                    <Checkbox
                        type={type}
                        label={text || label}
                        name={`${name}[${value}]`}
                        value={true}
                        checked={checked[value]}
                        onChange={onChange} {...opt}>{children}
                    </Checkbox>
                );
            })}
        </div>
    );
};

export default CheckBoxGroup;

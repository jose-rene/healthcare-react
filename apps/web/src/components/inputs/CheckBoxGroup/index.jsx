import React from "react";
import Checkbox from "../Checkbox";

const CheckBoxGroup = ({ options = false, name, onChange, checked = false }) => {
    return (
        <div>
            {options.map(({ text, label, value, children, ...opt }) => {
                return (
                    <Checkbox
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

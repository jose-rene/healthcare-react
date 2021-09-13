import React from "react";
import Checkbox from "../Checkbox";

const CheckBoxGroup = ({ options = false, name, value = 1, onChange, checked = false, ...props }) => {
    return (
        <div>
            {options.map(({ text, label, value, children, ...opt }) => {
                console.log("CheckBoxGroup.checkbox", { name: `${name}[${value}]` }, { props });
                return (
                    <Checkbox
                        label={text || label}
                        name={`${name}[${value}]`}
                        value={true}
                        checked={checked}
                        onChange={onChange} {...opt}>{children}
                    </Checkbox>
                );
            })}
        </div>
    );
};

export default CheckBoxGroup;

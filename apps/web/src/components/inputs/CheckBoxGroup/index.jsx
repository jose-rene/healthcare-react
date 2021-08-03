import React from 'react';
import Checkbox from "../Checkbox";

const CheckBoxGroup = ({ options = false, name, value = 1, onChange, ...props }) => {
    return (
        <div>
            {options.map(
                ({ text, label, value, children, ...opt }) => <Checkbox label={text || label} name={`${name}[${value}]`}
                                                                        value={true}
                                                                        onChange={onChange} {...opt}>{children}</Checkbox>)}
        </div>
    );
};

export default CheckBoxGroup;

import React, { useState } from "react";
import Switch from "react-bootstrap/Switch";

const CustomSwitch = () => {
    const [state, setState] = useState(false);

    const handleChange = () => {
        setState(state ? false : true);
    };

    return (
        <div>
            <Switch
                onChange={handleChange}
                color="primary"
                name="checkedB"
                inputprops={{ "aria-label": "primary checkbox" }}
            />
        </div>
    );
};

export default CustomSwitch;

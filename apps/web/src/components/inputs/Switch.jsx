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
                inputProps={{ "aria-label": "primary checkbox" }}
            />
        </div>
    );
};

export default CustomSwitch;

import React, { useState, useEffect } from "react";
import "./index.css";

function Switch({ checked = false, disabled = false, ...otherProps }) {
    const [isToggled, setIsToggled] = useState(false);
    // const onToggle = () => setIsToggled(!isToggled);

    useEffect(() => {
        setIsToggled(checked);
    }, [checked]);

    return (
        <label className="toggle-switch mt-2 mb-0">
            <input
                type="checkbox"
                checked={isToggled}
                disabled={disabled}
                {...otherProps}
            />
            <span className="switch" />
        </label>
    );
}
export default Switch;

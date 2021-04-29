import React, { useState } from "react";
import "./index.css";

function Switch() {
    const [isToggled, setIsToggled] = useState(false);
    const onToggle = () => setIsToggled(!isToggled);

    return (
        <label className="toggle-switch mt-2 mb-0">
            <input type="checkbox" checked={isToggled} onChange={onToggle} />
            <span className="switch" />
        </label>
    );
}
export default Switch;

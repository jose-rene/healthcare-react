import React from "react";
import { Dropdown, ButtonGroup, Button } from "react-bootstrap";

const ButtonWithDropdown = ({
    label,
    variant = "primary",
    name = "button-dropdown",
    options = [],
    onClick,
    className = "",
    disabled,
}) => {
    const handleOnClick = (button, index = "-1", buttonProps = {}) => {
        onClick({ button, index, buttonProps });
    };

    return (
        <Dropdown as={ButtonGroup} disabled={disabled} className={className}>
            <Button variant={variant} onClick={() => handleOnClick("main")}>
                {label}
            </Button>
            <Dropdown.Toggle split variant={variant} id={name} />
            <Dropdown.Menu>
                {options.map((o, index) => (
                    <Dropdown.Item
                        eventKey={index}
                        onClick={() => handleOnClick("option", 1, o)}
                    >
                        {o.text || "Action"}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default ButtonWithDropdown;

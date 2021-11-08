import React from "react";
import { useHistory } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";

import FapIcon from "components/elements/FapIcon";
import Select from "components/contextInputs/Select";
import Form from "components/elements/Form";

import "./MenuUser.scss";

/* eslint-disable jsx-a11y/anchor-is-valid */
const MenuUser = ({
    full_name,
    avatar_url,
    logOut,
    primaryRole,
    roles,
    handleRoleSwitch,
}) => {
    const history = useHistory();

    return (
        <NavDropdown
            data-testid="userinfo"
            id="user-options"
            align="end"
            title={
                <>
                    <span className="d-none d-sm-inline">{full_name}</span>
                    <img
                        alt="Settings"
                        className="rounded-circle ms-2"
                        style={{ height: "40px" }}
                        src={avatar_url || "/images/icons/user.png"}
                    />
                    <FapIcon icon="angle-down" />
                </>
            }
        >
            <Form defaultData={{ primaryRole }}>
                {roles?.length && (
                    <>
                        <NavDropdown.ItemText>
                            <Select
                                name="primaryRole"
                                label="Switch Role"
                                options={roles}
                                value={primaryRole}
                                onChange={handleRoleSwitch}
                            />
                        </NavDropdown.ItemText>
                    </>
                )}
            </Form>
            <NavDropdown.Item
                onClick={() => history.push("/account")}
                className="py-2"
            >
                <FapIcon icon="user" />
                <span className="ms-2">Manage Account</span>
            </NavDropdown.Item>
            <NavDropdown.Item
                onClick={() => console.log("Settings!")}
                className="py-2"
            >
                <FapIcon icon="settings" size="lg" />
                <span className="ms-2">Settings</span>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={logOut}>
                <FapIcon icon="logout" />
                <span className="ms-2">Logout</span>
            </NavDropdown.Item>
        </NavDropdown>
    );
};

export default MenuUser;

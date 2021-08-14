import React from "react";
import { NavDropdown } from "react-bootstrap";
import Icon from "../../components/elements/Icon";
import Select from "../../components/inputs/Select";

/* eslint-disable jsx-a11y/anchor-is-valid */
const PageHeader = ({
    full_name,
    avatar_url,
    toggleMenu,
    logOut,
    primaryRole,
    roles,
    handleRoleSwitch,
}) => {
    return (
        <div className="header d-flex">
            <div className="align-items-center w-50 d-flex">
                <img src="/images/logo-header.png" alt="" />

                <div className="mobile-menu d-sm-none">
                    <button
                        type="button"
                        onClick={toggleMenu}
                        className="btn btn-outline ml-1"
                    >
                        <Icon icon="bars" />
                    </button>
                </div>
                <div className="header-search d-none d-lg-block">
                    <Icon icon="search" className="header-icon" />
                    <input
                        className="search-input"
                        type="text"
                        placeholder="What are you looking for?"
                    />
                </div>
            </div>

            <div className="d-flex w-50 align-items-center justify-content-end">
                <a href="#">
                    <Icon icon="notification" className="header-icon" />
                </a>

                <NavDropdown
                    data-testid="userinfo"
                    alignRight
                    id="user-options"
                    title={
                        <>
                            <img
                                alt="Me"
                                className="header-avatar"
                                src={avatar_url || "/images/icons/user.png"}
                            />
                            {full_name}
                        </>
                    }
                >
                    <NavDropdown.Item>
                        <div className="d-flex align-items-center">
                            <Icon
                                icon="user"
                                size="1x"
                                className="header-icon"
                            />
                            <a
                                href="#"
                                onClick={() => console.log("Manage Account!")}
                                className="dropdown-item ps-0"
                                title="Manage Account"
                            >
                                Manage Account
                            </a>
                        </div>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>
                        <div className="d-flex align-items-center">
                            <Icon
                                icon="cog"
                                size="1x"
                                className="header-icon"
                            />
                            <a
                                href="#"
                                onClick={() => console.log("Settings!")}
                                className="dropdown-item ps-0"
                                title="Settings"
                            >
                                Settings
                            </a>
                        </div>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    {roles && roles.length > 1 && (
                        <>
                            <NavDropdown.ItemText>
                                <Select
                                    name="primaryRole"
                                    placeholder="Switch Role"
                                    options={roles}
                                    value={primaryRole}
                                    onChange={handleRoleSwitch}
                                />
                            </NavDropdown.ItemText>
                            <NavDropdown.Divider />
                        </>
                    )}
                    <NavDropdown.Item>
                        <a
                            href="/"
                            onClick={logOut}
                            className="dropdown-item"
                            title="Logout"
                        >
                            Logout
                        </a>
                    </NavDropdown.Item>
                </NavDropdown>
            </div>
        </div>
    );
};

export default PageHeader;

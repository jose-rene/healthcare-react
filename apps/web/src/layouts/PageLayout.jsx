import React, { useMemo, useState } from "react";
import { NavDropdown } from "react-bootstrap";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "../actions/authAction";
import Icon from "../components/elements/Icon";
import TimeoutModal from "../components/elements/TimeoutModal";
import Select from "../components/inputs/Select";
import { INACTIVITY_TIMEOUT, LOGOUT_COUNTDOWN_TIME } from "../config/Login";
import { PUT } from "../config/URLs";
import useApiCall from "../hooks/useApiCall";
import useIdleTimeout from "../hooks/useIdleTimeout";
import checkMiddleware from "../helpers/user";

/* eslint-disable jsx-a11y/anchor-is-valid */
const PageLayout = ({
    full_name,
    email,
    avatar_url,
    signOut,
    children,
    primaryRole,
    roles: _roles,
    abilities,
}) => {
    const [{ showTimeoutModal }, { dismissTimeout }] = useIdleTimeout({
        timeout: INACTIVITY_TIMEOUT,
    });
    const [{}, fireSavePrimaryRole] = useApiCall({
        url: "user/profile",
        method: PUT,
    });

    const logOut = async (e) => {
        e.preventDefault();
        await signOut();
        window.location.reload();
    };

    const [{ showMenu }, setMenu] = useState({
        showMenu: false,
    });

    const roles = useMemo(() => {
        return _roles.map((r) => ({
            id: r.name,
            val: r.name,
            title: r.title,
        }));
    }, [_roles]);

    const toggleMenu = () => {
        setMenu(() => ({
            showMenu: !showMenu,
        }));
    };

    const handlePrimaryRoleChanged = async ({ target: { name, value } }) => {
        if (value != primaryRole) {
            await fireSavePrimaryRole({
                params: {
                    primary_role: value,
                },
            });
            window.location.reload();
        }
    };

    const location = useLocation();
    const page = location.pathname ? location.pathname.replace("/", "") : "";

    return (
        <>
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
                                    onClick={() =>
                                        console.log("Manage Account!")
                                    }
                                    className="dropdown-item pl-0"
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
                                    className="dropdown-item pl-0"
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
                                        onChange={handlePrimaryRoleChanged}
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

            <div className={`sidebar ${showMenu ? "d-block" : ""}`}>
                <ul className="sidebar-items">
                    <li
                        className={page === "dashboard" ? "sidebar-active" : ""}
                        data-toggle="tooltip"
                        title="Dashboard"
                    >
                        <Link to="/dashboard">
                            <img src="/images/icons/home.png" alt="Home" />
                            <div className="d-block d-sm-none">Home</div>
                        </Link>
                    </li>
                    {checkMiddleware(
                        ["hp_user", "hp_manager", "hp_champion"], // need to change role with admin
                        primaryRole,
                        abilities
                    ) && (
                        <li
                            className={
                                page === "admin/companies" ||
                                page === "admin/add-companies"
                                    ? "sidebar-active"
                                    : ""
                            }
                            data-toggle="tooltip"
                            title="Companies"
                        >
                            <Link to="/admin/companies">
                                <img
                                    src="/images/icons/briefcase.png"
                                    alt="Companies"
                                />
                                <div className="d-block d-sm-none">
                                    Companies
                                </div>
                            </Link>
                        </li>
                    )}
                    {checkMiddleware(
                        ["hp_user", "hp_manager", "hp_champion"], // need to change role with admin
                        primaryRole,
                        abilities
                    ) && (
                        <li
                            className={
                                page === "admin/clinicians"
                                    ? "sidebar-active"
                                    : ""
                            }
                            data-toggle="tooltip"
                            title="Clinicians"
                        >
                            <Link to="/admin/clinicians">
                                <img
                                    src="/images/icons/first-aid-kit.png"
                                    alt="Clinicians"
                                />
                                <div className="d-block d-sm-none">
                                    Clinicians
                                </div>
                            </Link>
                        </li>
                    )}
                    {checkMiddleware(
                        ["hp_user", "hp_manager", "hp_champion"],
                        primaryRole,
                        abilities
                    ) && (
                        <li
                            className={
                                page === "healthplan/start-request"
                                    ? "sidebar-active"
                                    : ""
                            }
                            data-toggle="tooltip"
                            title="Search Member"
                        >
                            <Link to="/healthplan/start-request">
                                <img
                                    src="/images/icons/request.png"
                                    alt="Requests"
                                />
                                <div className="d-block d-sm-none">
                                    Requests
                                </div>
                            </Link>
                        </li>
                    )}
                    {checkMiddleware(
                        ["hp_user", "hp_manager", "hp_champion"],
                        primaryRole,
                        abilities
                    ) && (
                        <li
                            className={
                                page === "healthplan/requests"
                                    ? "sidebar-active"
                                    : ""
                            }
                            title="Search Requests"
                        >
                            <Link to="/healthplan/requests">
                                <img
                                    src="/images/icons/search.png"
                                    alt="Search Requests"
                                />
                            </Link>
                        </li>
                    )}
                    <li
                        className={page === "account" ? "sidebar-active" : ""}
                        data-toggle="tooltip"
                        title="Account"
                    >
                        <Link to="/account">
                            <img src="/images/icons/user.png" alt="Account" />
                            <div className="d-block d-sm-none">Account</div>
                        </Link>
                    </li>
                    <li
                        className={page === "payments" ? "sidebar-active" : ""}
                        data-toggle="tooltip"
                        title="Payments"
                    >
                        <Link to="/payments">
                            <img src="/images/icons/pay.png" alt="Pay" />
                            <div className="d-block d-sm-none">Pay</div>
                        </Link>
                    </li>
                    <li
                        className={
                            page === "healthplan/training"
                                ? "sidebar-active"
                                : ""
                        }
                        data-toggle="tooltip"
                        title="Training"
                    >
                        <Link to="/healthplan/training">
                            <img src="/images/icons/video.png" alt="Videos" />
                            <div className="d-block d-sm-none">Videos</div>
                        </Link>
                    </li>
                    <li
                        className={page === "help" ? "sidebar-active" : ""}
                        data-toggle="tooltip"
                        title="Help"
                    >
                        <Link to="/help">
                            <img src="/images/icons/question.png" alt="Help" />
                            <div className="d-block d-sm-none">Help</div>
                        </Link>
                    </li>
                    <li>
                        <a href="/" title="Logout" onClick={logOut}>
                            <img src="/images/icons/logout.png" alt="Log Out" />
                            <div className="d-block d-sm-none">Log Out</div>
                        </a>
                    </li>
                </ul>
            </div>

            <div className="content-container">{children}</div>
            <TimeoutModal
                show={showTimeoutModal}
                onHide={dismissTimeout}
                handleLogout={logOut}
                logoutCountdown={LOGOUT_COUNTDOWN_TIME}
            />
        </>
    );
};

const mapStateToProps = ({
    user: { email, full_name, primaryRole, roles, abilities, avatar_url },
}) => ({
    email,
    full_name,
    roles,
    abilities,
    primaryRole,
    avatar_url,
});

const mapDispatchToProps = {
    signOut,
};

export default connect(mapStateToProps, mapDispatchToProps)(PageLayout);

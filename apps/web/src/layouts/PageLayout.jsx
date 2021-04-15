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

                    <img
                        alt=""
                        className="header-avatar"
                        src="/images/icons/user.png"
                    />
                    <NavDropdown data-testid="userinfo" alignRight id="user-options" title={full_name}>
                        <NavDropdown.ItemText>{email}</NavDropdown.ItemText>
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
                    >
                        <Link to="/dashboard">
                            <img src="/images/icons/home.png" alt="Home" />
                        </Link>
                    </li>
                    {checkMiddleware(["hp_manager", "hp_champion"], primaryRole, abilities) && (
                        <li className={page === "requests" ? "sidebar-active" : ""}>
                            <Link to="/healthplan/start-request">
                                <img
                                    src="/images/icons/request.png"
                                    alt="Requests"
                                />
                            </Link>
                        </li>)}
                    <li className={page === "account" ? "sidebar-active" : ""}>
                        <Link to="/account">
                            <img src="/images/icons/user.png" alt="Account" />
                        </Link>
                    </li>
                    <li className={page === "payments" ? "sidebar-active" : ""}>
                        <Link to="/payments">
                            <img src="/images/icons/pay.png" alt="Pay" />
                        </Link>
                    </li>
                    <li className={page === "training" ? "sidebar-active" : ""}>
                        <Link to="/training">
                            <img src="/images/icons/video.png" alt="Videos" />
                        </Link>
                    </li>
                    <li className={page === "help" ? "sidebar-active" : ""}>
                        <Link to="/help">
                            <img src="/images/icons/question.png" alt="Help" />
                        </Link>
                    </li>
                    <li>
                        <a href="/" title="Logout" onClick={logOut}>
                            <img src="/images/icons/logout.png" alt="Log Out" />
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
    user: { email, full_name, primaryRole, roles, abilities },
}) => ({
    email,
    full_name,
    roles,
    abilities,
    primaryRole,
});

const mapDispatchToProps = {
    signOut,
};

export default connect(mapStateToProps, mapDispatchToProps)(PageLayout);

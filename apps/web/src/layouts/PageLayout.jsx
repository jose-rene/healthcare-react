import React, { useMemo, useState } from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import FapIcon from "../components/elements/FapIcon";
import TimeoutModal from "../components/elements/TimeoutModal";
import { signOut } from "../actions/authAction";
import { INACTIVITY_TIMEOUT, LOGOUT_COUNTDOWN_TIME } from "../config/Login";
import { PUT } from "../config/URLs";
import useApiCall from "../hooks/useApiCall";
import useIdleTimeout from "../hooks/useIdleTimeout";
import PageHeader from "./components/Header";
import SidebarHealthplan from "./components/sidebar/SidebarHealthplan";
import MenuHealthplan from "./components/menu/MenuHealthplan";

/* eslint-disable jsx-a11y/anchor-is-valid */
const PageLayout = ({
    full_name,
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

    // state for show mobile menu offcanvas
    const [showMenu, setMenu] = useState(false);

    const handleShowMenu = () => {
        setMenu(true);
    };

    const handleCloseMenu = () => {
        setMenu(false);
    };

    const logOut = async (e) => {
        e.preventDefault();
        await signOut();
        window.location.reload();
    };

    const roles = useMemo(() => {
        return _roles.map((r) => ({
            id: r.name,
            val: r.name,
            title: r.title,
        }));
    }, [_roles]);

    const [{ loading }, fireSavePrimaryRole] = useApiCall({
        url: "user/profile",
        method: PUT,
    });

    const handleRoleSwitch = async ({ target: { name, value } }) => {
        if (value !== primaryRole) {
            await fireSavePrimaryRole({
                params: {
                    primary_role: value,
                },
            });

            if (!loading) {
                window.location.reload();
            }
        }
    };

    const [open, setOpen] = useState(true);
    const toggleOpen = () => {
        // console.log("toggle open");
        setOpen(!open);
    };

    return (
        <>
            <PageHeader
                {...{
                    full_name,
                    avatar_url,
                    primaryRole,
                    roles,
                    handleShowMenu,
                    handleRoleSwitch,
                    logOut,
                }}
            />
            <div className="container-fluid d-flex p-0">
                <div
                    className={`collapse-sidebar d-none d-sm-block${
                        open ? "" : " collapsed"
                    }`}
                >
                    <div className="position-fixed d-flex flex-column h-100 min-vh-100 bg-white">
                        <SidebarHealthplan
                            {...{ logOut, primaryRole, abilities, open }}
                        />
                        <div className="mt-auto text-center">
                            <Button
                                variant="link"
                                onClick={toggleOpen}
                                className="p-0 border-0 text-center d-none d-lg-inline"
                            >
                                <span
                                    className={`d-none mb-2 p-2 ${
                                        open ? "d-lg-inline" : ""
                                    }`}
                                >
                                    <FapIcon
                                        icon="angle-double-left"
                                        className="me-2"
                                    />
                                    <span>Collapse sidebar</span>
                                </span>
                                <FapIcon
                                    icon="angle-double-right"
                                    className={open ? "d-lg-none" : ""}
                                />
                            </Button>
                            <Button
                                variant="link"
                                onClick={handleShowMenu}
                                className="p-0 border-0 text-center d-lg-none"
                            >
                                <FapIcon icon="angle-double-right" />
                            </Button>
                        </div>
                    </div>
                </div>
                <MenuHealthplan
                    show={showMenu}
                    onHide={handleCloseMenu}
                    backdrop
                />
                <div className="p-2 flex-grow-1" style={{ marginTop: "70px" }}>
                    {children}
                </div>
            </div>
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

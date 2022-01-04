import React, { useMemo, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useUser } from "Context/UserContext";
import FapIcon from "../components/elements/FapIcon";
import TimeoutModal from "../components/elements/TimeoutModal";
import { INACTIVITY_TIMEOUT, LOGOUT_COUNTDOWN_TIME } from "../config/Login";
import { PUT } from "../config/URLs";
import useApiCall from "../hooks/useApiCall";
import useIdleTimeout from "../hooks/useIdleTimeout";
import PageHeader from "./components/Header";
import PageFooter from "./components/Footer";
import Sidebar from "./components/sidebar";
import Menu from "./components/menu";

import "styles/PageLayout.scss";

/* eslint-disable jsx-a11y/anchor-is-valid */
const PageLayout = ({ loading: childloading = false, children }) => {
    const [{ showTimeoutModal }, { dismissTimeout }] = useIdleTimeout({
        timeout: INACTIVITY_TIMEOUT,
    });

    const { getUser, logout: signOut } = useUser();
    const {
        full_name,
        avatar_url,
        primaryRole,
        roles: _roles,
        abilities,
    } = getUser();

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
                    <div
                        className="position-fixed d-flex flex-column h-100 min-vh-100 bg-white"
                        style={{ zIndex: 1 }}
                    >
                        <Sidebar
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
                <Menu
                    show={showMenu}
                    onHide={handleCloseMenu}
                    backdrop
                    {...{ logOut, primaryRole, abilities, open }}
                />
                <div className="p-3 flex-grow-1 layuot">
                    {childloading ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="secondary" />
                        </div>
                    ) : (
                        children
                    )}
                </div>
            </div>
            <PageFooter />
            <TimeoutModal
                show={showTimeoutModal}
                onHide={dismissTimeout}
                handleLogout={logOut}
                logoutCountdown={LOGOUT_COUNTDOWN_TIME}
            />
        </>
    );
};

export default PageLayout;

import React, { useMemo, useState } from "react";
import { connect } from "react-redux";
import TimeoutModal from "../components/elements/TimeoutModal";
import { signOut } from "../actions/authAction";
import { INACTIVITY_TIMEOUT, LOGOUT_COUNTDOWN_TIME } from "../config/Login";
import { PUT } from "../config/URLs";
import useApiCall from "../hooks/useApiCall";
import useIdleTimeout from "../hooks/useIdleTimeout";
import PageHeader from "./components/Header";
import PageSidebar from "./components/Sidebar";

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

    const [{ showMenu }, setMenu] = useState({
        showMenu: false,
    });

    const toggleMenu = () => {
        setMenu(() => ({
            showMenu: !showMenu,
        }));
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

    const handlePrimaryRoleChanged = async ({ target: { name, value } }) => {
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

    return (
        <>
            <PageHeader
                full_name={full_name}
                avatar_url={avatar_url}
                logOut={logOut}
                primaryRole={primaryRole}
                roles={roles}
                toggleMenu={toggleMenu}
                handleRoleSwitch={handlePrimaryRoleChanged}
            />
            <div className="container-fluid">
                <PageSidebar
                    logOut={logOut}
                    primaryRole={primaryRole}
                    abilities={abilities}
                    showMenu={showMenu}
                />
                <div className="content-container">{children}</div>
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

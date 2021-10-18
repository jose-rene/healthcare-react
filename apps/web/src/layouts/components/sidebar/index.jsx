import React from "react";
import { useLocation } from "react-router-dom";
import { Nav } from "react-bootstrap";

import { useUser } from "Context/UserContext";

import SidebarHealthplan from "./SidebarHealthplan";
import SidebarClinician from "./SidebarClinician";
import SidebarAdmin from "./SidebarAdmin";

import FapIcon from "components/elements/FapIcon";

/* eslint-disable jsx-a11y/anchor-is-valid */
const Sidebar = ({ logOut, primaryRole, abilities, open }) => {
    const { userCan } = useUser();
    const location = useLocation();
    const page = location.pathname ?? "";
    const textClass = `d-none ${open ? "d-lg-inline" : ""}`;

    return (
        <Nav
            defaultActiveKey={page}
            className="flex-column sidebar-hp"
            style={{ marginTop: "70px" }}
        >
            <Nav.Link href="/dashboard">
                <FapIcon icon="home" size="lg" className="me-2" />
                <span className={textClass}>Home</span>
            </Nav.Link>
            {userCan("create-users") && (
                <Nav.Link href="/admin/users">
                    <FapIcon icon="users" size="lg" className="me-2" />
                    <span className={textClass}>Users</span>
                </Nav.Link>
            )}
            <Nav.Link href="/account">
                <FapIcon icon="user" size="lg" className="me-2" />
                <span className={textClass}>Account</span>
            </Nav.Link>

            {(primaryRole === "hp_user" ||
                primaryRole === "hp_finance" ||
                primaryRole === "hp_champion" ||
                primaryRole === "hp_manager") && (
                <SidebarHealthplan {...{ open }} />
            )}

            {(primaryRole === "clinical_reviewer" ||
                primaryRole === "field_clinician") && (
                <SidebarClinician {...{ open }} />
            )}

            {primaryRole === "software_engineer" && (
                <SidebarAdmin {...{ open }} />
            )}

            <Nav.Link
                eventKey="logout"
                onClick={logOut}
                title="logout"
                role="link"
            >
                <FapIcon icon="sign-out" size="lg" className="me-2" />
                <span className={textClass}>Log Out</span>
            </Nav.Link>
        </Nav>
    );
};

export default Sidebar;

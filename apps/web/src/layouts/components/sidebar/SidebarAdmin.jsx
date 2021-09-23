import React from "react";
import { Nav } from "react-bootstrap";

import FapIcon from "components/elements/FapIcon";

/* eslint-disable jsx-a11y/anchor-is-valid */
const SidebarAdmin = ({ open }) => {
    const textClass = `d-none ${open ? "d-lg-inline" : ""}`;

    return (
        <>
            <Nav.Link href="/admin/forms">
                <FapIcon icon="book" size="lg" className="me-2" />
                <span className={textClass}>Forms</span>
            </Nav.Link>

            <Nav.Link href="/admin/companies">
                <FapIcon icon="building" size="lg" className="me-2" />
                <span className={textClass}>Companies</span>
            </Nav.Link>

            <Nav.Link href="/admin/clinicians">
                <FapIcon icon="user-nurse" size="lg" className="me-2" />
                <span className={textClass}>Clinicians</span>
            </Nav.Link>

            <Nav.Link href="/admin/users">
                <FapIcon icon="users" size="lg" className="me-2" />
                <span className={textClass}>Users</span>
            </Nav.Link>
        </>
    );
};

export default SidebarAdmin;

import React from "react";
import { Nav, NavDropdown } from "react-bootstrap";

import FapIcon from "components/elements/FapIcon";

import "./sidebar.scss";

/* eslint-disable jsx-a11y/anchor-is-valid */
const SidebarAdmin = ({ open }) => {
    const textClass = `d-none ${open ? "d-lg-inline" : ""}`;

    return (
        <>
            <Nav.Link href="/admin/users">
                <FapIcon icon="users" size="lg" className="me-2" />
                <span className={textClass}>Users</span>
            </Nav.Link>

            <NavDropdown
                title={
                    <>
                        <FapIcon icon="glasses" size="lg" className="me-2" />
                        <span className={textClass}>Assessments</span>
                    </>
                }
                data-testid="adminSidebar"
                id="admin-siebar"
                align="end"
            >
                <NavDropdown.Item className="py-2" href="/admin/assessments">
                    <FapIcon icon="glasses" size="1x" />
                    <span className="ms-2">Assessments</span>
                </NavDropdown.Item>

                <NavDropdown.Item
                    className="py-2"
                    href="/admin/assessment/rules"
                >
                    <FapIcon icon="books" size="1x" />
                    <span className="ms-2">Rules</span>
                </NavDropdown.Item>

                <NavDropdown.Item className="py-2" href="/admin/forms">
                    <FapIcon icon="book" size="1x" />
                    <span className="ms-2">Forms</span>
                </NavDropdown.Item>

                <NavDropdown.Item
                    className="py-2"
                    href="/admin/narrative-report"
                >
                    <FapIcon icon="newspaper" size="1x" />
                    <span className="ms-2">Narrative Editor</span>
                </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="/admin/clients">
                <FapIcon icon="building" size="lg" className="me-2" />
                <span className={textClass}>Clients</span>
            </Nav.Link>

            <Nav.Link href="/admin/clinicians">
                <FapIcon icon="user-nurse" size="lg" className="me-2" />
                <span className={textClass}>Clinicians</span>
            </Nav.Link>
        </>
    );
};

export default SidebarAdmin;

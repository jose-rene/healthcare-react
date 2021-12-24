import React from "react";
import { Nav, NavDropdown } from "react-bootstrap";

import FapIcon from "components/elements/FapIcon";

/* eslint-disable jsx-a11y/anchor-is-valid */
const MenuAdmin = () => {
    return (
        <>
            <Nav.Link
                href="/admin/users"
                className="list-group-item border-end-0"
            >
                <FapIcon icon="users" className="me-2" fixedWidth />
                <span>Users</span>
            </Nav.Link>

            <NavDropdown
                title={
                    <>
                        <FapIcon icon="glasses" className="me-2" fixedWidth />
                        <span>Assessments</span>
                    </>
                }
                data-testid="adminSidebar"
                align="end"
            >
                <NavDropdown.Item href="/admin/assessments">
                    <FapIcon icon="glasses" className="me-2" fixedWidth />
                    <span>Assessments</span>
                </NavDropdown.Item>

                <NavDropdown.Item href="/admin/assessments">
                    <FapIcon icon="books" className="me-2" fixedWidth />
                    <span>Rules</span>
                </NavDropdown.Item>

                <NavDropdown.Item href="/admin/forms">
                    <FapIcon icon="book" className="me-2" fixedWidth />
                    <span>Forms</span>
                </NavDropdown.Item>

                <NavDropdown.Item href="/admin/narrative-report">
                    <FapIcon icon="newspaper" className="me-2" fixedWidth />
                    <span>Narrative Editor</span>
                </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link
                href="/admin/clients"
                className="list-group-item border-end-0"
            >
                <FapIcon icon="building" className="me-2" fixedWidth />
                <span>Clients</span>
            </Nav.Link>

            <Nav.Link
                href="/admin/clinicians"
                className="list-group-item border-end-0"
            >
                <FapIcon icon="user-nurse" className="me-2" fixedWidth />
                <span>Clinicians</span>
            </Nav.Link>
        </>
    );
};

export default MenuAdmin;

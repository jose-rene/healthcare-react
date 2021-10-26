import React from "react";
import { Nav } from "react-bootstrap";

import FapIcon from "components/elements/FapIcon";

/* eslint-disable jsx-a11y/anchor-is-valid */
const MenuAdmin = () => {
    return (
        <>
            <Nav.Link
                href="/admin/assessments"
                className="list-group-item border-end-0"
            >
                <FapIcon icon="glasses" className="me-2" fixedWidth />
                <span>Assessments</span>
            </Nav.Link>
            <Nav.Link
                href="/admin/forms"
                className="list-group-item border-end-0"
            >
                <FapIcon icon="book" className="me-2" fixedWidth />
                <span>Forms</span>
            </Nav.Link>
            <Nav.Link
                href="/admin/companies"
                className="list-group-item border-end-0"
            >
                <FapIcon icon="building" className="me-2" fixedWidth />
                <span>Companies</span>
            </Nav.Link>
            <Nav.Link
                href="/admin/clinicians"
                className="list-group-item border-end-0"
            >
                <FapIcon icon="user-nurse" className="me-2" fixedWidth />
                <span>Clinicians</span>
            </Nav.Link>
            <Nav.Link
                href="/admin/users"
                className="list-group-item border-end-0"
            >
                <FapIcon icon="users" className="me-2" fixedWidth />
                <span>Users</span>
            </Nav.Link>
        </>
    );
};

export default MenuAdmin;

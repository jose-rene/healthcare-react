import React from "react";
import { Nav } from "react-bootstrap";

import FapIcon from "components/elements/FapIcon";

/* eslint-disable jsx-a11y/anchor-is-valid */
const MenuHealthplan = () => {
    return (
        <>
            <Nav.Link
                href="/healthplan/start-request"
                className="list-group-item border-end-0"
            >
                <FapIcon icon="file-medical-alt" className="me-2" fixedWidth />
                <span>New Request</span>
            </Nav.Link>
            <Nav.Link href="/invoices" className="list-group-item border-end-0">
                <FapIcon icon="file-invoice" className="me-2" fixedWidth />
                <span>Invoices</span>
            </Nav.Link>
            <Nav.Link
                href="https://lms.periscope365.com"
                className="list-group-item border-end-0"
                target="_blank"
            >
                <FapIcon icon="book-reader" className="me-2" fixedWidth />
                <span>Training</span>
            </Nav.Link>
            <Nav.Link
                href="https://periscope365.atlassian.net/servicedesk/customer/portal/2"
                className="list-group-item border-end-0"
                target="_blank"
            >
                <FapIcon icon="question-circle" className="me-2" fixedWidth />
                <span>Tech Support</span>
            </Nav.Link>
        </>
    );
};

export default MenuHealthplan;

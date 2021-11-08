import React from "react";
import { Nav } from "react-bootstrap";

import FapIcon from "components/elements/FapIcon";

/* eslint-disable jsx-a11y/anchor-is-valid */
const SidebarHealthplan = ({ open }) => {
    const textClass = `d-none ${open ? "d-lg-inline" : ""}`;

    return (
        <>
            <Nav.Link href="/healthplan/start-request">
                <FapIcon icon="file-medical-alt" size="lg" className="me-2" />
                <span className={textClass}>New Request</span>
            </Nav.Link>
            <Nav.Link href="/invoices">
                <FapIcon icon="file-invoice" size="lg" className="me-2" />
                <span className={textClass}>Invoices</span>
            </Nav.Link>
            <Nav.Link href="/healthplan/training">
                <FapIcon icon="book-reader" size="lg" className="me-2" />
                <span className={textClass}>Training</span>
            </Nav.Link>
            <Nav.Link href="/support">
                <FapIcon icon="question-circle" size="lg" className="me-2" />
                <span className={textClass}>Tech Support</span>
            </Nav.Link>
        </>
    );
};

export default SidebarHealthplan;

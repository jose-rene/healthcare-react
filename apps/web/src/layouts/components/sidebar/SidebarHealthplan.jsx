import React from "react";
import { useLocation } from "react-router-dom";
import { Nav } from "react-bootstrap";
import FapIcon from "../../../components/elements/FapIcon";

/* eslint-disable jsx-a11y/anchor-is-valid */
const SidebarHealthplan = ({ logOut, primaryRole, abilities, open }) => {
    const location = useLocation();
    const page = location.pathname ?? "";
    console.log(page);
    const textClass = `d-none ${open ? "d-lg-inline" : ""}`;

    return (
        <Nav
            defaultActiveKey={page}
            className="flex-column"
            style={{ marginTop: "80px" }}
        >
            <Nav.Link href="/dashboard">
                <FapIcon icon="home" size="lg" className="me-2" />
                <span className={textClass}>Home</span>
            </Nav.Link>
            <Nav.Link href="/account">
                <FapIcon icon="user" size="lg" className="me-2" />
                <span className={textClass}>Account</span>
            </Nav.Link>
            <Nav.Link href="/training">
                <FapIcon icon="book-reader" size="lg" className="me-2" />
                <span className={textClass}>Training</span>
            </Nav.Link>
            <Nav.Link href="/support">
                <FapIcon icon="question-circle" size="lg" className="me-2" />
                <span className={textClass}>Tech Support</span>
            </Nav.Link>
            <Nav.Link href="/healthplan/start-request">
                <FapIcon icon="file-medical-alt" size="lg" className="me-2" />
                <span className={textClass}>New Request</span>
            </Nav.Link>
            <Nav.Link href="/invoices">
                <FapIcon icon="file-invoice" size="lg" className="me-2" />
                <span className={textClass}>Invoices</span>
            </Nav.Link>
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

export default SidebarHealthplan;

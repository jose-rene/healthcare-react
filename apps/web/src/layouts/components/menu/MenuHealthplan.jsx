import React from "react";
import { useLocation } from "react-router-dom";
import { Nav, Offcanvas } from "react-bootstrap";
import FapIcon from "../../../components/elements/FapIcon";
import checkMiddleware from "../../../helpers/user";

/* eslint-disable jsx-a11y/anchor-is-valid */
const MenuHealthplan = ({ logOut, primaryRole, abilities, ...props }) => {
    const location = useLocation();
    const page = location.pathname ?? "";
    // console.log(page);
    const textClass = "";

    return (
        <Offcanvas {...props} style={{ zIndex: 1050 }}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Periscope</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Nav defaultActiveKey={page} className="flex-column">
                    <Nav.Link
                        href="/dashboard"
                        className="list-group-item border-end-0"
                    >
                        <FapIcon icon="home" size="lg" className="me-2" />
                        <span className={textClass}>Home</span>
                    </Nav.Link>
                    <Nav.Link
                        href="/account"
                        className="list-group-item border-end-0"
                    >
                        <FapIcon icon="user" size="lg" className="me-2" />
                        <span className={textClass}>Account</span>
                    </Nav.Link>
                    <Nav.Link
                        href="/training"
                        className="list-group-item border-end-0"
                    >
                        <FapIcon
                            icon="book-reader"
                            size="lg"
                            className="me-2"
                        />
                        <span className={textClass}>Training</span>
                    </Nav.Link>
                    <Nav.Link
                        href="/support"
                        className="list-group-item border-end-0"
                    >
                        <FapIcon
                            icon="question-circle"
                            size="lg"
                            className="me-2"
                        />
                        <span className={textClass}>Tech Support</span>
                    </Nav.Link>
                    <Nav.Link
                        href="/healthplan/start-request"
                        className="list-group-item border-end-0"
                    >
                        <FapIcon
                            icon="file-medical-alt"
                            size="lg"
                            className="me-2"
                        />
                        <span className={textClass}>New Request</span>
                    </Nav.Link>
                    <Nav.Link
                        href="/invoices"
                        className="list-group-item border-end-0"
                    >
                        <FapIcon
                            icon="file-invoice"
                            size="lg"
                            className="me-2"
                        />
                        <span className={textClass}>Invoices</span>
                    </Nav.Link>
                    <Nav.Link
                        eventKey="logout"
                        onClick={logOut}
                        title="logout"
                        role="link"
                        className="list-group-item border-end-0"
                    >
                        <FapIcon icon="sign-out" size="lg" className="me-2" />
                        <span className={textClass}>Log Out</span>
                    </Nav.Link>
                </Nav>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default MenuHealthplan;

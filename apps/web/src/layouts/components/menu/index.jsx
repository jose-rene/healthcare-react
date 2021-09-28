import React from "react";
import { useLocation } from "react-router-dom";
import { Nav, Offcanvas } from "react-bootstrap";

import MenuHealthplan from "./MenuHealthplan";
import MenuClinician from "./MenuClinician";
import MenuAdmin from "./MenuAdmin";

import FapIcon from "components/elements/FapIcon";

/* eslint-disable jsx-a11y/anchor-is-valid */
const Menu = ({ logOut, primaryRole, abilities, ...props }) => {
    const location = useLocation();
    const page = location.pathname ?? "";
    const textClass = "";

    return (
        <Offcanvas {...props} style={{ zIndex: 1050 }}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>
                    <img
                        src="/icon/apple-icon-60x60.png"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt="Periscope"
                    />
                    <span className="ms-1">Periscope</span>
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Nav defaultActiveKey={page} className="flex-column">
                    <Nav.Link
                        href="/dashboard"
                        className="list-group-item border-end-0"
                    >
                        <FapIcon icon="home" className="me-2" fixedWidth />
                        <span>Home</span>
                    </Nav.Link>
                    <Nav.Link
                        href="/account"
                        className="list-group-item border-end-0"
                    >
                        <FapIcon icon="user" className="me-2" fixedWidth />
                        <span>Account</span>
                    </Nav.Link>

                    {(primaryRole === "hp_user" ||
                        primaryRole === "hp_finance" ||
                        primaryRole === "hp_champion" ||
                        primaryRole === "hp_manager") && <MenuHealthplan />}

                    {(primaryRole === "clinical_reviewer" ||
                        primaryRole === "field_clinician") && <MenuClinician />}

                    {primaryRole === "software_engineer" && <MenuAdmin />}

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

export default Menu;

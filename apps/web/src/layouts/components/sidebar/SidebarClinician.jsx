import React from "react";
import { Nav } from "react-bootstrap";

import FapIcon from "components/elements/FapIcon";

/* eslint-disable jsx-a11y/anchor-is-valid */
const SidebarClinician = ({ open }) => {
    const textClass = `d-none ${open ? "d-lg-inline" : ""}`;

    return (
        <>
            <Nav.Link href="#">
                <FapIcon icon="briefcase-medical" size="lg" className="me-2" />
                <span className={textClass}>Therapist</span>
            </Nav.Link>
            <Nav.Link href="#">
                <FapIcon icon="phone-square" size="lg" className="me-2" />
                <span className={textClass}>Requests</span>
            </Nav.Link>
        </>
    );
};

export default SidebarClinician;

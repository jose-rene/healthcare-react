import React from "react";
import { Nav } from "react-bootstrap";

import FapIcon from "components/elements/FapIcon";

/* eslint-disable jsx-a11y/anchor-is-valid */
const MenuClinician = () => {
    return (
        <>
            <Nav.Link href="#" className="list-group-item border-end-0">
                <FapIcon icon="briefcase-medical" className="me-2" fixedWidth />
                <span>Therapist</span>
            </Nav.Link>

            <Nav.Link href="#" className="list-group-item border-end-0">
                <FapIcon icon="phone-square" className="me-2" fixedWidth />
                <span>Requests</span>
            </Nav.Link>
        </>
    );
};

export default MenuClinician;

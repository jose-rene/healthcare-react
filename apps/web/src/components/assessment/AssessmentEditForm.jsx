import React, { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";

import ScheduleView from "./views/ScheduleView";

const AssessmentEditForm = () => {
    const [[openMember], setToggler] = useState([false]);

    const setOpenMember = (open) => {
        setToggler([open]);
    };
    const toggleOpenMember = () => {
        setOpenMember(!openMember);
    };

    return (
        <>
            <Row className="justify-content-lg-center">
                <Col xl={11}>
                    <Card className="mb-3 border-0 bg-light">
                        <Card.Body
                            className="px-0 pb-0"
                            style={{ zIndex: "0" }}
                        >
                            <ul className="progressbar">
                                <li className="active">
                                    Ready to {"\n"} Schedule
                                </li>
                                <li>Appointment {"\n"} Scheduled</li>
                                <li>Appointment {"\n"} Completed</li>
                                <li> Member {"\n"} Assessed</li>
                                <li>Report {"\n"} Complete</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="justify-content-lg-center">
                <Col xl={10}>
                    <ScheduleView {...{ openMember, toggleOpenMember }} />
                </Col>
            </Row>
        </>
    );
};

export default AssessmentEditForm;

import React from "react";
import { Row, Col } from "react-bootstrap";

import Textarea from "components/inputs/Textarea";

const TabNotes = () => {
    return (
        <Row className="mt-4">
            <Col md={12} lg={7}>
                <Textarea
                    className="form-control custom-textarea-input"
                    value="Activity Update"
                />
            </Col>
        </Row>
    );
};

export default TabNotes;

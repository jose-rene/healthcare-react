import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";

import ContextInput from "components/inputs/ContextInput";
import ContextRadioInput from "components/inputs/ContextRadioInput";
import ContextSelect from "components/contextInputs/Select";
import Textarea from "components/inputs/Textarea";

const ScheduleForm = ({
    reasonOptions,
    startTimeOptions,
    endTimeOptions,
    updateData,
}) => {
    const [status, setStatus] = useState(null);

    const onChange = (e) => {
        setStatus(e.target.value);
    };

    return (
        <>
            <Row>
                <Col>
                    <ContextInput
                        name="scheduled_date"
                        label="Date called"
                        type="date"
                    />
                </Col>
            </Row>
            <Row className="mb-3">
                <Col md={8}>Was an appointment scheduled?</Col>
                <Col md={2}>
                    <ContextRadioInput
                        label="Yes"
                        name="status"
                        onChange={onChange}
                    />
                </Col>
                <Col md={2}>
                    <ContextRadioInput
                        label="No"
                        name="status"
                        onChange={onChange}
                    />
                </Col>
            </Row>
            {status === "No" && (
                <>
                    <Row>
                        <Col>
                            <ContextSelect
                                name="reason"
                                label="Reason:"
                                options={reasonOptions}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Textarea
                                label="Comments"
                                name="comments"
                                type="textarea"
                                rows={5}
                            />
                        </Col>
                    </Row>
                </>
            )}

            {status === "Yes" && (
                <>
                    <Row>
                        <Col>
                            <ContextInput
                                name="appt_date"
                                label="Appt Date"
                                type="date"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <label className="mb-3">Appointment Time Window</label>
                        <Col>
                            <ContextSelect
                                label="Start Time"
                                name="start_time"
                                options={startTimeOptions}
                                onChange={updateData}
                            />
                        </Col>
                        <Col>
                            <ContextSelect
                                label="End Time"
                                name="end_time"
                                options={endTimeOptions}
                                onChange={updateData}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Textarea
                                label="Comments"
                                name="comments"
                                type="textarea"
                                rows={5}
                            />
                        </Col>
                    </Row>
                </>
            )}
        </>
    );
};

export default ScheduleForm;

import React from "react";
import { Row, Col } from "react-bootstrap";

import { useFormContext } from "Context/FormContext";

import ContextRadioInput from "components/inputs/ContextRadioInput";
import Textarea from "components/inputs/Textarea";

import AppointmentScheduleForm from "./AppointmentScheduleForm";

const RescheduleForm = ({ reasonOptions }) => {
    const { update, getValue } = useFormContext();

    const onChange = (e) => {
        update(e.target.name, e.target.value);
    };

    return (
        <div>
            <Row className="mb-3">
                <Col className="fw-bold" md={4}>
                    I would like to
                </Col>
                <Col md={5} className="d-flex">
                    <div className="mx-2">
                        <ContextRadioInput
                            label="Re-Schedule"
                            name="is_cancelled"
                            checked={getValue("is_cancelled") === "Re-Schedule"}
                            onChange={onChange}
                        />
                    </div>

                    <div className="mx-2">
                        <ContextRadioInput
                            label="Cancel Appointment"
                            name="is_cancelled"
                            checked={
                                getValue("is_cancelled") ===
                                "Cancel Appointment"
                            }
                            onChange={onChange}
                        />
                    </div>
                </Col>
            </Row>

            {getValue("is_cancelled") && (
                <Row className="mb-3">
                    <Col className="fw-bold" md={4}>
                        This change was initiated by:
                    </Col>
                    <Col md={6} className="d-flex">
                        <div className="mx-2">
                            <ContextRadioInput
                                label="Member"
                                name="initiated_by"
                                checked={getValue("initiated_by") === "Member"}
                                onChange={onChange}
                            />
                        </div>

                        <div className="mx-2">
                            <ContextRadioInput
                                label="Me"
                                name="initiated_by"
                                checked={getValue("initiated_by") === "Me"}
                                onChange={onChange}
                            />
                        </div>

                        <div className="mx-2">
                            <ContextRadioInput
                                label="No Show"
                                name="initiated_by"
                                checked={getValue("initiated_by") === "No Show"}
                                onChange={onChange}
                            />
                        </div>
                    </Col>
                </Row>
            )}

            {(getValue("initiated_by") === "Member" ||
                getValue("initiated_by") === "Me") &&
                getValue("is_cancelled") === "Cancel Appointment" && (
                    <Row className="mb-3">
                        <Col md={9}>
                            <Textarea
                                label="Reason"
                                name="reason"
                                type="textarea"
                                rows={5}
                                onChange={onChange}
                            />
                        </Col>
                    </Row>
                )}

            {getValue("initiated_by") &&
                getValue("is_cancelled") === "Re-Schedule" && (
                    <AppointmentScheduleForm
                        reschedule
                        reasonOptions={reasonOptions}
                        update={update}
                        getValue={getValue}
                        onChange={onChange}
                    />
                )}
        </div>
    );
};

export default RescheduleForm;

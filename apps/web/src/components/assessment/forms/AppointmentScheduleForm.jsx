import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";

import ContextInput from "components/inputs/ContextInput";
import ContextSelect from "components/contextInputs/Select";
import Textarea from "components/inputs/Textarea";
import ContextRadioInput from "components/inputs/ContextRadioInput";

import { getTimes } from "helpers/datetime";

const AppointmentScheduleForm = ({
    reschedule = false,
    reasonOptions,
    update,
    getValue,
    onChange,
}) => {
    const [startTimeOptions] = useState(getTimes("07:00", 28, 30));
    const [endTimeOptions, setEndTimeOptions] = useState([
        { id: "", title: "", val: "" },
    ]);

    const getIndexTimes = (selectedTime) => {
        const selectedOption = startTimeOptions.filter((time) => {
            return selectedTime === time?.value;
        });

        return selectedOption[0]?.id;
    };

    const updateData = (e) => {
        update(e.target.name, e.target.value);

        if (e.target.name === "start_time") {
            const index = getIndexTimes(e.target.value);
            let calcTimes = getTimes(
                e.target.value,
                28 - index >= 6 ? 7 : 28 - index + 1,
                30
            );
            calcTimes.splice(1, 1);
            setEndTimeOptions(calcTimes);
        }
    };

    return (
        <>
            <Row className="mb-3">
                {reschedule ? (
                    <Col className="fw-bold" md={4}>
                        Are you setting the new date now?
                    </Col>
                ) : (
                    <Col md={5}>Was an appointment scheduled?</Col>
                )}
                <Col className="d-flex" md={4}>
                    <div className="mx-2">
                        <ContextRadioInput
                            label="Yes"
                            name="is_scheduled"
                            checked={getValue("is_scheduled") === "Yes"}
                            onChange={onChange}
                        />
                    </div>

                    <div className="mx-2">
                        <ContextRadioInput
                            label="No"
                            name="is_scheduled"
                            checked={getValue("is_scheduled") === "No"}
                            onChange={onChange}
                        />
                    </div>
                </Col>
            </Row>
            {getValue("is_scheduled") === "No" && (
                <>
                    {!reschedule && (
                        <Row>
                            <Col>
                                <ContextSelect
                                    name="reason"
                                    label="Reason:"
                                    options={reasonOptions}
                                />
                            </Col>
                        </Row>
                    )}
                    <Row className="mb-3">
                        <Col>
                            <Textarea
                                label={reschedule ? "Reason" : "Comments"}
                                name={reschedule ? "reason" : "comments"}
                                type="textarea"
                                rows={5}
                                onChange={onChange}
                            />
                        </Col>
                    </Row>
                </>
            )}

            {getValue("is_scheduled") === "Yes" && (
                <>
                    <Row>
                        <Col>
                            <ContextInput
                                name="appointment_date"
                                label="Appt Date"
                                type="date"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <label
                            className={`mb-3 ${reschedule ? "fw-bold" : ""}`}
                        >
                            Appointment Time Window
                        </label>
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
                                label={reschedule ? "Reason" : "Comments"}
                                name={reschedule ? "reason" : "comments"}
                                type="textarea"
                                rows={5}
                                onChange={onChange}
                            />
                        </Col>
                    </Row>
                </>
            )}
        </>
    );
};

export default AppointmentScheduleForm;

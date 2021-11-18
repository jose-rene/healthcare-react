import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";

import { useFormContext } from "Context/FormContext";

import ContextInput from "components/inputs/ContextInput";
import ContextRadioInput from "components/inputs/ContextRadioInput";
import ContextSelect from "components/contextInputs/Select";
import Textarea from "components/inputs/Textarea";

import { getTimes } from "helpers/datetime";

const ScheduleForm = ({ reasonOptions }) => {
    const { update, getValue } = useFormContext();

    const [startTimeOptions] = useState(getTimes("07:00", 28, 30));
    const [endTimeOptions, setEndTimeOptions] = useState([
        { id: "", title: "", val: "" },
    ]);

    const onChange = (e) => {
        update(e.target.name, e.target.value);
    };

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
            <Row>
                <Col>
                    <ContextInput
                        name="called_at"
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
                        name="is_scheduled"
                        checked={getValue("is_scheduled") === "Yes"}
                        onChange={onChange}
                    />
                </Col>
                <Col md={2}>
                    <ContextRadioInput
                        label="No"
                        name="is_scheduled"
                        checked={getValue("is_scheduled") === "No"}
                        onChange={onChange}
                    />
                </Col>
            </Row>
            {getValue("is_scheduled") === "No" && (
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
                                onChange={onChange}
                            />
                        </Col>
                    </Row>
                </>
            )}
        </>
    );
};

export default ScheduleForm;

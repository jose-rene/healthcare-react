import React from "react";
import { Row, Col } from "react-bootstrap";

import { useFormContext } from "Context/FormContext";

import ContextInput from "components/inputs/ContextInput";

import AppointmentScheduleForm from "./AppointmentScheduleForm";

const ScheduleForm = ({ reasonOptions }) => {
    const { update, getValue, objUpdate } = useFormContext();

    const onChange = (e) => {
        update(e.target.name, e.target.value);
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

            <AppointmentScheduleForm
                scheduled={getValue("is_scheduled")}
                reasonOptions={reasonOptions}
                update={update}
                objUpdate={objUpdate}
                getValue={getValue}
                onChange={onChange}
            />
        </>
    );
};

export default ScheduleForm;

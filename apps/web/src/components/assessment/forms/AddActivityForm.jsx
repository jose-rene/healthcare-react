import React from "react";
import { Row, Col } from "react-bootstrap";

import { useFormContext } from "Context/FormContext";

import ContextCheckbox from "components/contextInputs/Checkbox";
import Textarea from "components/inputs/Textarea";

const AddActivityForm = ({ reply = false }) => {
    const { update } = useFormContext();

    const onChange = (e) => {
        update(e.target.name, e.target.value);
    };

    return (
        <Row>
            {!reply && (
                <Col md={12}>
                    <ContextCheckbox
                        label="Priority"
                        name="priority"
                        wrapperClass="form-check pb-3 px-0"
                    />
                </Col>
            )}
            <Col md={12}>
                <Textarea
                    label="Message"
                    name="message"
                    type="textarea"
                    rows={5}
                    onChange={onChange}
                />
            </Col>
        </Row>
    );
};

export default AddActivityForm;

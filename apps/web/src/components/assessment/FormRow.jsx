import React from "react";
import { Row, Col } from "react-bootstrap";
import { sortableElement, sortableHandle } from "react-sortable-hoc";

import { Input } from "components";
import FapIcon from "components/elements/FapIcon";

const DragHandle = sortableHandle(() => (
    <FapIcon icon="grip-vertical" className="mb-3" />
));

const FormRow = sortableElement(({ name, value, onRemove }) => (
    <Row>
        <Col md={7} className="d-flex align-items-center">
            <DragHandle />
            <div className="w-100">
                <Input
                    name={name}
                    label={`Form ${name + 1}`}
                    value={value}
                    disabled
                />
            </div>
        </Col>
        <Col md={2}>
            <FapIcon icon="times-circle" onClick={onRemove} />
        </Col>
    </Row>
));

export default FormRow;

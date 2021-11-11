import React from "react";
import { Col, Row } from "react-bootstrap";

import { Input } from "../../index";
import Select from "../../inputs/Select";
import FapIcon from "../FapIcon";

const ContactMethodRow = ({
    // input names
    type,
    value,

    // other props
    types = [],
    showRemove = false,
    onRemove,
    onChange,
}) => {
    return (
        <Row>
            <Col md={4}>
                <Select
                    addEmpty
                    name="type"
                    value={type}
                    label="Type*"
                    options={types}
                    onChange={onChange}
                    required
                />
            </Col>

            <Col md={4}>
                <Input
                    name="value"
                    label="Phone/Email*"
                    required
                    onChange={onChange}
                    value={value}
                />
            </Col>

            {showRemove ? (
                <Col md={2}>
                    <FapIcon
                        icon="times-circle"
                        onClick={onRemove}
                        className="mt-3"
                    />
                </Col>
            ) : (
                <Col md={2} />
            )}
        </Row>
    );
};

export default ContactMethodRow;

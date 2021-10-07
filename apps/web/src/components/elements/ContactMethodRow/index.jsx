import React from "react";
import { Col, Row } from "react-bootstrap";

import { Button, Input } from "../../index";
import Select from "../../inputs/Select";

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
                <Col md={4}>
                    <Button
                        block
                        variant="danger"
                        label="remove"
                        icon="cancel"
                        iconSize="1x"
                        onClick={onRemove}
                    />
                </Col>
            ) : (
                <Col md={2} />
            )}
        </Row>
    );
};

export default ContactMethodRow;

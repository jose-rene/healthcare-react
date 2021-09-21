import React from "react";
import { Col, Row } from "react-bootstrap";
import { Button, Input } from "../../index";
import Select from "../../inputs/Select";

const ContactMethodRow = ({
    // input names
    type,
    phone_email,

    // other props
    types = [],
    showRemove = false,
    onRemove,
    onChange,
}) => {
    return (
        <Row>
            <Col md={5}>
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

            <Col md={5}>
                <Input
                    name="phone_email"
                    label="Phone/Email*"
                    required
                    onChange={onChange}
                    value={phone_email}
                />
            </Col>

            {showRemove ? (
                <Col md={2}>
                    <Button
                        block
                        variant="danger"
                        label="remove"
                        icon="cancel"
                        iconSize="1x"
                        onClick={onRemove}
                    />
                </Col>
            ) : <Col md={2} />}
        </Row>
    );
};

export default ContactMethodRow;

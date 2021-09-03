import React, { useMemo } from "react";
import { Row, Col } from "react-bootstrap";
import { isEmpty } from "lodash";

import ContextInput from "components/inputs/ContextInput";
import ContextSelect from "components/contextInputs/Select";
import { Button } from "components/index";

import types from "config/Types.json";

const ContactMethods = ({ contactMethods, setContactMethods }) => {
    const typesOptions = useMemo(() => {
        if (isEmpty(types)) {
            return [];
        }

        const result = [{ id: "", title: "", val: "" }];
        for (const [key, value] of Object.entries(types)) {
            result.push({
                id: value,
                title: value,
                val: key,
            });
        }

        return result;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [types]);

    const renderContactMethods = () => {
        return contactMethods.map(({ type, phone_email }, index) => (
            <Row key={type}>
                <Col md={4}>
                    <ContextSelect
                        name={type}
                        label="Type*"
                        options={typesOptions}
                        required
                    />
                </Col>

                <Col md={4}>
                    <ContextInput
                        name={phone_email}
                        label="Phone/Email*"
                        required
                    />
                </Col>

                {contactMethods.length > 1 && (
                    <Col md={4}>
                        <Button
                            className="btn btn-danger px-3 mb-3"
                            label="remove"
                            icon="cancel"
                            iconSize="1x"
                            onClick={() => removeContactMethod(type)}
                        />
                    </Col>
                )}
            </Row>
        ));
    };

    const addNewContactMethod = () => {
        const index = contactMethods.length;

        setContactMethods(
            contactMethods.concat({
                type: `type_${index}`,
                phone_email: `phone_email_${index}`,
            })
        );
    };

    const removeContactMethod = (type) => {
        const filtered = contactMethods.filter((item) => {
            return type !== item.type;
        });

        setContactMethods(filtered);
    };

    return (
        <Row>
            {renderContactMethods()}

            <Col md={12}>
                <Button
                    className="mb-3"
                    variant="primary"
                    size="lg"
                    block
                    onClick={() => addNewContactMethod()}
                >
                    + Add new contact method
                </Button>
            </Col>
        </Row>
    );
};

export default ContactMethods;

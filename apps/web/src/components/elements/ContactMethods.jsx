import React, { useMemo, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { isEmpty } from "lodash";

import { Button } from "components/index";

import ContactMethodRow from "./ContactMethodRow";

import { useFormContext } from "Context/FormContext";

import types from "config/Types.json";

const ContactMethods = () => {
    const { update, getValue } = useFormContext();
    const contactMethods = getValue("contacts", []);

    useEffect(() => {
        if (contactMethods.length === 0) {
            addNewContactMethod();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contactMethods]);

    const handleOnChange = (index, { target: { name, value } }) => {
        update(`contacts.${index}.${name}`, value);
    };

    const typesOptions = useMemo(() => {
        if (isEmpty(types)) {
            return [];
        }

        const result = [];
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

    const addNewContactMethod = () => {
        const index = contactMethods.length;

        update(`contacts.${index}`, {
            type: "",
            value: "",
        });
    };

    const removeContactMethod = (contactIndex) => {
        const filtered = contactMethods.filter((item, itemIndex) => {
            return contactIndex !== itemIndex;
        });

        update("contacts", filtered);
    };

    return (
        <Row>
            <Col md={12}>
                {contactMethods.map((item, index) => (
                    <ContactMethodRow
                        types={typesOptions}
                        key={`contact-row-${index}`}
                        showRemove={contactMethods.length > 1}
                        onRemove={() => removeContactMethod(index)}
                        onChange={(e) => handleOnChange(index, e)}
                        {...item}
                    />
                ))}
            </Col>

            <Col md={12}>
                <Button
                    className="mb-3"
                    variant="primary"
                    size="lg"
                    block
                    onClick={addNewContactMethod}
                >
                    + Add new contact method
                </Button>
            </Col>
        </Row>
    );
};

export default ContactMethods;

import React, { useMemo, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { isEmpty } from "lodash";
import { Button } from "components/index";

import types from "config/Types.json";
import { useFormContext } from "../../Context/FormContext";
import ContactMethodRow from "./ContactMethodRow";

const ContactMethods = () => {
    const { update, getValue } = useFormContext();
    const contactMethods = getValue("contact_methods", []);

    useEffect(() => {
        if (contactMethods.length == 0) {
            addNewContactMethod();
        }
    }, [contactMethods]);

    const handleOnChange = (index, { target: { name, value } }) => {
        update(`contact_methods.${index}.${name}`, value);
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

        update(`contact_methods.${index}`, {
            type: "",
            phone_email: "",
        });
    };

    const removeContactMethod = (contactIndex) => {
        const filtered = contactMethods.filter((item, itemIndex) => {
            return contactIndex !== itemIndex;
        });

        update("contact_methods", filtered);
    };

    return (
        <Row>
            <Col md={12}>
                {contactMethods.map((c, index) => (
                    <ContactMethodRow
                        types={typesOptions}
                        key={`contact-row-${index}`}
                        showRemove={contactMethods.length > 1}
                        onRemove={() => removeContactMethod(index)}
                        onChange={e => handleOnChange(index, e)}
                        {...c}
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

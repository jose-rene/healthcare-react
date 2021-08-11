import React from "react";
import Textarea from "../../../inputs/Textarea";
import { Card, Accordion } from "react-bootstrap";

const CustomValidation = ({
    element,
    name = "customValidation",
    updateElement,
    eventKey,
    ...props
}) => {
    const { props: { [name]: customValidation = "" } = "" } = element || {};

    return (
        <Card border="danger">
            <Accordion.Toggle as={Card.Header} eventKey={eventKey}>
                Special Validation
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={eventKey}>
                <Card.Body>
                    <Textarea
                        value={customValidation}
                        name="customValidation"
                        rows={5}
                        helpText={
                            <a
                                href="https://lodash.com/docs/4.17.15#template"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Template help
                            </a>
                        }
                        {...props}
                    />
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    );
};

export default CustomValidation;

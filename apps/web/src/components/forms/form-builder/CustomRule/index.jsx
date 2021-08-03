import React from 'react';
import Textarea from "../../../inputs/Textarea";
import { Card, Accordion } from "react-bootstrap";

const CustomRule = ({
    element,
    name = 'customRule',
    updateElement,
    eventKey,
    ...props
}) => {
    const { props: { [name]: customRule = '' } = '' } = element || {};

    return (

        <Card border="primary">
            <Accordion.Toggle as={Card.Header} eventKey={eventKey}>
                Special Rules
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={eventKey}>
                <Card.Body>
                    <Textarea
                        value={customRule}
                        name="customRule"
                        rows={5}
                        helpText={<>When this condition is <u><strong>false</strong></u> this field will not show up</>}
                        {...props}
                    />
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    );
};

export default CustomRule;

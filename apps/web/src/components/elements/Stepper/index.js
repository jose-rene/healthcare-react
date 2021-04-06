import React, { useState } from "react";
import { Accordion, Card } from "react-bootstrap";

import Button from "../../inputs/Button";

import NewRequestAddSteps1 from "../../../pages/newRequestAddSteps/NewRequestAddSteps1";
import NewRequestAddSteps2 from "../../../pages/newRequestAddSteps/NewRequestAddSteps2";
import NewRequestAddSteps3 from "../../../pages/newRequestAddSteps/NewRequestAddSteps3";
import NewRequestAddSteps4 from "../../../pages/newRequestAddSteps/NewRequestAddSteps4";
import NewRequestAddSteps5 from "../../../pages/newRequestAddSteps/NewRequestAddSteps5";

import "./stepper.css";

const getSteps = () => {
    return [
        "Verify Member Information",
        "Unique Assessment ID",
        "Relevant Diagnosis",
        "Request Type",
        "Due Date",
    ];
};

const getStepContent = (step) => {
    switch (step) {
        case 0:
            return <NewRequestAddSteps1 />;
        case 1:
            return <NewRequestAddSteps2 />;
        case 2:
            return <NewRequestAddSteps3 />;
        case 3:
            return <NewRequestAddSteps4 />;
        case 4:
            return <NewRequestAddSteps5 />;
    }
};

const Stepper = () => {
    const steps = getSteps();
    const [activeStep, setActiveStep] = useState(0);

    return (
        <>
            {steps.map((label, index) => {
                return (
                    <Accordion
                        key={label}
                        defaultActiveKey={`${activeStep}`}
                        activeKey={`${activeStep}`}
                    >
                        <Card className="step">
                            <Accordion.Toggle
                                className="step-header"
                                as={Card.Header}
                                eventKey={`${index}`}
                            >
                                {index < activeStep ? (
                                    <div className="step-header-active-circle">
                                        <i className="fas fa-check" />
                                    </div>
                                ) : (
                                    <div className="step-header-circle" />
                                )}
                                {label}
                            </Accordion.Toggle>
                            {index !== activeStep && index !== 4 && (
                                <Card.Body
                                    className="step-body"
                                    style={{ height: "24px" }}
                                ></Card.Body>
                            )}
                            <Accordion.Collapse eventKey={`${index}`}>
                                <Card.Body
                                    className="step-body"
                                    style={{ borderLeft: index === 4 && 0 }}
                                >
                                    {getStepContent(index)}
                                    <div className="form-row mt-5">
                                        <div className="col-md-6">
                                            <Button
                                                block
                                                outline
                                                onClick={() =>
                                                    setActiveStep(
                                                        index > 0
                                                            ? index - 1
                                                            : index
                                                    )
                                                }
                                            >
                                                Back
                                            </Button>
                                        </div>
                                        <div className="col-md-6">
                                            <Button
                                                block
                                                variant="primary"
                                                className="btn-lg"
                                                onClick={() =>
                                                    setActiveStep(
                                                        index < 5
                                                            ? index + 1
                                                            : index
                                                    )
                                                }
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                );
            })}
        </>
    );
};

export default Stepper;

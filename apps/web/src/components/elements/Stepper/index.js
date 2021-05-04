import React, { useState, useEffect } from "react";
import { Accordion, Card } from "react-bootstrap";

import Button from "../../inputs/Button";

import NewRequestAddSteps1 from "../../../pages/newRequestAddSteps/NewRequestAddSteps1";
import NewRequestAddSteps2 from "../../../pages/newRequestAddSteps/NewRequestAddSteps2";
import NewRequestAddSteps3 from "../../../pages/newRequestAddSteps/NewRequestAddSteps3";
import NewRequestAddSteps4 from "../../../pages/newRequestAddSteps/NewRequestAddSteps4";
import NewRequestAddSteps5 from "../../../pages/newRequestAddSteps/NewRequestAddSteps5";

import useApiCall from "../../../hooks/useApiCall";

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

const getStepContent = (step, data, editData, payerProfile, setParams) => {
    switch (step) {
        case 1:
            return (
                <NewRequestAddSteps2
                    memberData={editData}
                    setParams={setParams}
                />
            );
        case 2:
            return (
                <NewRequestAddSteps3
                    data={data}
                    setParams={setParams}
                    requestData={editData}
                />
            );
        case 3:
            return (
                <NewRequestAddSteps4
                    data={data}
                    setParams={setParams}
                    requestData={editData}
                />
            );
        case 4:
            return (
                <NewRequestAddSteps5
                    memberData={editData}
                    setParams={setParams}
                />
            );

        default:
            return (
                <NewRequestAddSteps1
                    memberData={data}
                    payerProfile={payerProfile}
                />
            );
    }
};

const Stepper = ({ data }) => {
    const steps = getSteps();
    const [activeStep, setActiveStep] = useState(0);
    const [params, setParams] = useState();
    const [editData, setEditData] = useState();

    const request_uuid = data.id;

    const [{ data: requestData, loading, error }, fireSubmit] = useApiCall({
        method: "put",
        url: `request/${request_uuid}`,
    });

    const [{ data: payerProfile }, payerProfileRequest] = useApiCall({
        url: "payer/profile",
    });

    useEffect(() => {
        setEditData(data);
    }, [data]);

    useEffect(() => {
        payerProfileRequest();
    }, []);

    const handleUpdate = async () => {
        try {
            const result = await fireSubmit({ params });
            setEditData(result);
        } catch (e) {
            console.log("Request update error:", e);
        }
    };

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
                                onClick={() => setActiveStep(index)}
                                className="step-header c-pointer"
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
                                />
                            )}
                            <Accordion.Collapse eventKey={`${index}`}>
                                <Card.Body
                                    className="step-body"
                                    style={{ borderLeft: index === 4 && 0 }}
                                >
                                    {getStepContent(
                                        activeStep,
                                        data,
                                        editData,
                                        payerProfile,
                                        setParams
                                    )}
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
                                                onClick={() => {
                                                    if (activeStep !== 0) {
                                                        handleUpdate();
                                                    }
                                                    setActiveStep(
                                                        index < 5
                                                            ? index + 1
                                                            : index
                                                    );
                                                }}
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

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { isEmpty } from "lodash";
import { Accordion, Card } from "react-bootstrap";

import Button from "../../inputs/Button";

import NewRequestAddSteps1 from "../../../pages/newRequestAddSteps/NewRequestAddSteps1";
import NewRequestAddSteps2 from "../../../pages/newRequestAddSteps/NewRequestAddSteps2";
import NewRequestAddSteps3 from "../../../pages/newRequestAddSteps/NewRequestAddSteps3";
import NewRequestAddSteps4 from "../../../pages/newRequestAddSteps/NewRequestAddSteps4";
import NewRequestAddSteps5 from "../../../pages/newRequestAddSteps/NewRequestAddSteps5";
import { validate } from "../../../pages/newRequestAddSteps/validate";

import useApiCall from "../../../hooks/useApiCall";
import useToast from "../../../hooks/useToast";

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

const getStepContent = (
    step,
    data,
    editData,
    payerProfile,
    memberVerified,
    dueNa,
    setDueNa,
    setMemberVerified,
    handleUpdate,
    setParams
) => {
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
                    handleUpdate={handleUpdate}
                    dueNa={dueNa}
                    setDueNa={setDueNa}
                />
            );

        default:
            return (
                <NewRequestAddSteps1
                    memberData={data}
                    payerProfile={payerProfile}
                    memberVerified={memberVerified}
                    setMemberVerified={setMemberVerified}
                />
            );
    }
};

const Stepper = ({ data }) => {
    const steps = getSteps();
    const [activeStep, setActiveStep] = useState(0);
    const [params, setParams] = useState();
    const [editData, setEditData] = useState();
    const [activeStatus, setActiveStatus] = useState([0, 0, 0, 0, 0]);
    const [memberVerified, setMemberVerified] = useState([0, 0, 0, 0, 0]);
    const [dueNa, setDueNa] = useState(false);

    const { success: successMessage } = useToast();

    const history = useHistory();

    const request_uuid = data.id;

    const [{ data: requestData, loading, error }, fireSubmit] = useApiCall({
        method: "put",
        url: `request/${request_uuid}`,
    });

    const [{ data: payerProfile }, payerProfileRequest] = useApiCall({
        url: "payer/profile",
    });

    // checks that member has been verified by the user
    const isVerified = (verified) => {
        const count = verified.reduce((sum, value) => sum + value);
        return count === verified.length;
    };

    useEffect(() => {
        if (data?.member_verified) {
            setMemberVerified([1, 1, 1, 1, 1]);
        }
        setEditData(data);
    }, [data]);

    useEffect(() => {
        payerProfileRequest();
    }, []);

    useEffect(() => {
        setStatus(data);
    }, [data, memberVerified]);

    const handleUpdate = async (updateData = false, updateOnly = false) => {
        try {
            // need to check response when due_at save in the database.
            const result = await fireSubmit(
                updateData
                    ? { params: updateData }
                    : activeStep === 0
                    ? { params: { type_name: "verify" } }
                    : { params }
            );

            setEditData(result);
            setStatus({
                ...result,
                due_na: "due_na" in updateData ? updateData.due_na : dueNa,
            });
            if (activeStep === 4 && !updateOnly) {
                const status = validateStatus();
                if (status) {
                    history.push("/healthplan/requests");
                    successMessage("Reuqest Received.");
                }
            }
        } catch (e) {
            console.log("Request update error:", e);
        }
    };

    const setStatus = (param) => {
        if (!isEmpty(param)) {
            const temp = [];
            for (let i = 0; i < 5; i++) {
                if (i === 0) {
                    temp[i] = isVerified(memberVerified) ? 1 : 0;
                } else {
                    temp[i] = validate(i, param) ? 1 : 0;
                }
            }

            setActiveStatus(temp);
        }
    };

    const validateStatus = () => {
        if (activeStatus.indexOf(0) >= 0) {
            return false;
        }

        return true;
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
                                onClick={() => {
                                    setActiveStep(index);
                                }}
                                className="step-header c-pointer"
                                as={Card.Header}
                                eventKey={`${index}`}
                            >
                                {activeStatus[index] ? (
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
                                        memberVerified,
                                        dueNa,
                                        setDueNa,
                                        setMemberVerified,
                                        handleUpdate,
                                        setParams
                                    )}
                                    <div className="form-row mt-5">
                                        <div className="col-md-6">
                                            {activeStep !== 0 && (
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
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <Button
                                                block
                                                variant="primary"
                                                className="btn-lg"
                                                label={
                                                    activeStep === 4
                                                        ? "Submit Request"
                                                        : "Next"
                                                }
                                                disabled={
                                                    !!(
                                                        activeStep === 4 &&
                                                        !validateStatus()
                                                    )
                                                }
                                                onClick={() => {
                                                    setStatus(activeStep);
                                                    if (
                                                        activeStep !== 0 ||
                                                        isVerified(
                                                            memberVerified
                                                        )
                                                    ) {
                                                        handleUpdate();
                                                    }
                                                    setActiveStep(
                                                        index < 5
                                                            ? index + 1
                                                            : index
                                                    );
                                                }}
                                            />
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

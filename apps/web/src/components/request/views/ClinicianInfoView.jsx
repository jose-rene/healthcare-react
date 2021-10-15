import React, { useState, useEffect } from "react";
import { Button, Card, Collapse, Row, Col } from "react-bootstrap";
import LoadingOverlay from "react-loading-overlay";
import * as Yup from "yup";

import Form from "components/elements/Form";
import PageAlert from "components/elements/PageAlert";

import useApiCall from "hooks/useApiCall";
import FapIcon from "components/elements/FapIcon";
import ClinicianInfoForm from "../forms/ClinicianInfoForm";
import ReviewerInfoForm from "../forms/ReviewerInfoForm";

const ClinicianInfoView = ({
    requestId,
    clinician,
    reviewer,
    openClinicianInfo,
    toggleOpenClinicianInfo,
    refreshRequest,
    requestLoading,
}) => {
    const { id: clinicianId = null, name: clinicianName = null } =
        clinician || {};

    const { id: reviewerId = null, name: reviewerName = null } = reviewer || {};

    const [{ loading, error }, fireSubmit] = useApiCall({
        method: "put",
        url: `/request/${requestId}/assign`,
    });

    const [data, setData] = useState({});

    useEffect(() => {
        setData({ clinician_id: clinicianId, reviewer_id: reviewerId });
    }, [clinicianId, reviewerId]);

    const validation = {
        clinician_id: {
            yupSchema: Yup.string().required("Clinician is required"),
        },
    };

    const onSubmit = async (formData) => {
        if (loading) {
            return false;
        }

        try {
            await fireSubmit({
                params: formData,
            });
            setData({
                clinician_id: formData.clinician_id,
                reviewer_id: formData.reviewer_id,
            });
            refreshRequest("clinician");
        } catch (e) {
            console.log("Clinician Request assign error:", e);
        }
    };

    return (
        <>
            <Card className="border-1 border-top-0 border-end-0 border-start-0 bg-light mb-3">
                <Card.Header className="bg-light border-0 ps-2">
                    <div className="d-flex">
                        <div>
                            <h5 className="ms-2">Clinician Info</h5>
                        </div>
                        <div className="ms-auto">
                            {!openClinicianInfo && (
                                <Button
                                    variant="link"
                                    onClick={toggleOpenClinicianInfo}
                                >
                                    {clinicianId ? "edit" : "assign"}
                                </Button>
                            )}
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Collapse in={openClinicianInfo}>
                        <div>
                            {error && (
                                <PageAlert
                                    variant="warning"
                                    dismissible
                                    timeout={6000}
                                >
                                    {error}
                                </PageAlert>
                            )}
                            <LoadingOverlay
                                active={loading || requestLoading}
                                spinner
                                text="Processing..."
                                styles={{
                                    overlay: (base) => ({
                                        ...base,
                                        borderRadius: "12px",
                                    }),
                                }}
                            >
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form
                                            defaultData={data}
                                            validation={validation}
                                            onSubmit={onSubmit}
                                        >
                                            <ClinicianInfoForm />

                                            <ReviewerInfoForm />

                                            <Row>
                                                <Col>
                                                    <Button
                                                        variant="secondary"
                                                        onClick={
                                                            toggleOpenClinicianInfo
                                                        }
                                                        className="me-3"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button type="submit">
                                                        Assign
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Col>
                                </Row>
                            </LoadingOverlay>
                        </div>
                    </Collapse>
                    <Collapse in={!openClinicianInfo}>
                        <div>
                            <Row className="mb-3">
                                <Col className="fw-bold" sm={3}>
                                    Assigned Therapist
                                </Col>
                                <Col>
                                    {clinicianId ? (
                                        <p>{clinicianName}</p>
                                    ) : (
                                        <Button
                                            variant="link"
                                            className="fst-italic p-0"
                                            onClick={toggleOpenClinicianInfo}
                                        >
                                            Assign Therapist
                                            <FapIcon
                                                icon="angle-double-right"
                                                size="sm"
                                                className="ms-1"
                                            />
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                            <Row>
                                <Col className="fw-bold" sm={3}>
                                    Assigned Reviewer
                                </Col>
                                <Col>
                                    {reviewerId ? (
                                        <p>{reviewerName}</p>
                                    ) : (
                                        <Button
                                            variant="link"
                                            className="fst-italic p-0"
                                            onClick={toggleOpenClinicianInfo}
                                        >
                                            Assign Reviewer
                                            <FapIcon
                                                icon="angle-double-right"
                                                size="sm"
                                                className="ms-1"
                                            />
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                        </div>
                    </Collapse>
                </Card.Body>
            </Card>
        </>
    );
};

export default ClinicianInfoView;

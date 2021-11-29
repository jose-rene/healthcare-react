import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Collapse, Row, Col } from "react-bootstrap";
import LoadingOverlay from "react-loading-overlay";
import dayjs from "dayjs";

import Form from "components/elements/Form";
import PageAlert from "components/elements/PageAlert";
import FapIcon from "components/elements/FapIcon";

import ScheduleForm from "../forms/ScheduleForm";

import useApiCall from "hooks/useApiCall";

const ScheduleView = ({
    openMember,
    toggleOpenMember,
    assessmentData: data,
    setAssessmentData,
    error,
    reasonOptions,
}) => {
    const { id } = useParams();

    const [{ loading, error: formError }, fireSubmit] = useApiCall({
        method: "post",
        url: "/appointment",
    });

    const [defaultData] = useState({
        called_at: dayjs().format("YYYY-MM-DD"),
        start_time: "",
        end_time: "",
        is_scheduled: "",
        appointment_date: dayjs().format("YYYY-MM-DD"),
        reason: "",
        comments: "",
    });

    const onSubmit = async (formValues) => {
        const submitionValue = {
            ...formValues,
            ...{
                request_id: id,
                is_scheduled: formValues.is_scheduled === "Yes" ? true : false,
            },
        };

        try {
            const { called_at: called_date = null, appointment_date = null } =
                await fireSubmit({ params: submitionValue });
            setAssessmentData((prevData) => ({
                ...prevData,
                called_date,
                appointment_date,
            }));
            toggleOpenMember();
        } catch (e) {
            console.log(`Appointment create error:`, e);
        }
    };

    return (
        <>
            <Card className="border-1 border-top-0 border-end-0 border-start-0 bg-light mb-3">
                <Card.Header className="bg-light border-0 ps-2">
                    <div className="d-flex">
                        <div>
                            <h5 className="ms-2">Schedule Member</h5>
                        </div>
                        <div className="ms-auto">
                            {!openMember && (
                                <Button
                                    variant="link"
                                    onClick={toggleOpenMember}
                                >
                                    {data?.called_date ? `change` : `schedule`}
                                </Button>
                            )}
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Collapse in={openMember}>
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
                            {formError && (
                                <PageAlert
                                    variant="warning"
                                    dismissible
                                    timeout={6000}
                                >
                                    {formError}
                                </PageAlert>
                            )}
                            <LoadingOverlay
                                active={loading}
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
                                            defaultData={defaultData}
                                            onSubmit={onSubmit}
                                        >
                                            <ScheduleForm
                                                reasonOptions={reasonOptions}
                                            />

                                            <Row>
                                                <Col>
                                                    <Button
                                                        variant="secondary"
                                                        onClick={
                                                            toggleOpenMember
                                                        }
                                                        className="me-3"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button type="submit">
                                                        Submit
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Col>
                                </Row>
                            </LoadingOverlay>
                        </div>
                    </Collapse>
                    <Collapse in={!openMember}>
                        <div>
                            <Row className="mb-3">
                                <Col className="fw-bold" sm={3}>
                                    <p>Called Date</p>
                                    <p>Appointment Date</p>
                                </Col>
                                <Col>
                                    {data?.called_date ? (
                                        <>
                                            <p>{data?.called_date}</p>
                                            <p>
                                                {data?.appointment_date ||
                                                    "n/a"}
                                            </p>
                                        </>
                                    ) : (
                                        <Button
                                            variant="link"
                                            className="fst-italic p-0"
                                            onClick={toggleOpenMember}
                                        >
                                            Schedule Appointment
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

export default ScheduleView;

import React, { useState } from "react";
import { Button, Card, Collapse, Row, Col } from "react-bootstrap";
import LoadingOverlay from "react-loading-overlay";

import Form from "components/elements/Form";
import PageAlert from "components/elements/PageAlert";
import FapIcon from "components/elements/FapIcon";

import ScheduleForm from "../forms/ScheduleForm";

import { getTimes } from "helpers/datetime";

const ScheduleView = ({
    openMember,
    toggleOpenMember,
    scheduledDate,
    error,
    reasonOptions,
}) => {
    const [defaultData, setDefaultData] = useState({
        scheduled_date: scheduledDate,
        start_time: "",
        end_time: "",
    });

    const [endTimeOptions, setEndTimeOptions] = useState([
        { id: "", title: "", val: "" },
    ]);

    const [startTimeOptions] = useState(getTimes("07:00", 28, 30));

    const getIndexTimes = (selectedTime) => {
        const selectedOption = startTimeOptions.filter((time) => {
            return selectedTime === time?.value;
        });

        return selectedOption[0]?.id;
    };

    const updateData = (e) => {
        setDefaultData({
            ...defaultData,
            ...{ [e.target.name]: e.target.value },
        });

        if (e.target.name === "start_time") {
            const index = getIndexTimes(e.target.value);
            setEndTimeOptions(
                getTimes(e.target.value, 28 - index >= 6 ? 6 : 28 - index, 30)
            );
        }
    };

    const onSubmit = (formValues) => {};

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
                                    {scheduledDate ? `change` : `schedule`}
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
                            <LoadingOverlay
                                // active={loading || requestLoading}
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
                                            // validation={validation}
                                            onSubmit={onSubmit}
                                        >
                                            <ScheduleForm
                                                reasonOptions={reasonOptions}
                                                startTimeOptions={
                                                    startTimeOptions
                                                }
                                                endTimeOptions={endTimeOptions}
                                                updateData={updateData}
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
                    <Collapse in={!openMember}>
                        <div>
                            <Row className="mb-3">
                                <Col className="fw-bold" sm={3}>
                                    Scheduled Date
                                </Col>
                                <Col>
                                    {scheduledDate ? (
                                        <p>{scheduledDate}</p>
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

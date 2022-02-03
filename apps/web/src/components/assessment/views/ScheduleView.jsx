import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Collapse, Row, Col } from "react-bootstrap";
import LoadingOverlay from "react-loading-overlay";
import dayjs from "dayjs";

import { useUser } from "Context/UserContext";

import Form from "components/elements/Form";
import PageAlert from "components/elements/PageAlert";
import FapIcon from "components/elements/FapIcon";
import ConfirmationModal from "components/elements/ConfirmationModal";

import useApiCall from "hooks/useApiCall";
import { fromUtcTime } from "helpers/datetime";
import ScheduleForm from "../forms/ScheduleForm";
import RescheduleForm from "../forms/RescheduleForm";

const ScheduleView = ({
    openSchedule,
    toggleOpenSchedule,
    assessmentData: data,
    error,
    reasonOptions,
    refreshAssessment,
    refreshLoading,
    valid,
}) => {
    const { id } = useParams();

    const { getUser } = useUser();
    const { timeZoneName, timeZone } = getUser();

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [form, setForm] = useState(null);

    const [{ loading, error: formError }, fireSubmit] = useApiCall({
        method: "post",
        url: "/appointment",
    });

    const [
        { loading: rescheduleLoading, error: rescheduleFormError },
        fireRescheduleSubmit,
    ] = useApiCall({
        method: "post",
        url: "/appointment/reschedule",
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

    const [defaultRescheduleData] = useState({
        appointment_date: "",
        start_time: "",
        end_time: "",
        is_cancelled: false,
        initiated_by: "",
        is_scheduled: false,
        reason: "",
    });

    const submitSchedule = async (formValues) => {
        const submissionValue = {
            ...formValues,
            ...{
                request_id: id,
                is_scheduled: formValues.is_scheduled === "Yes",
                timeZone,
            },
        };

        try {
            await fireSubmit({ params: submissionValue });

            setShowConfirmationModal(false);
            refreshAssessment("schedule");
        } catch (e) {
            console.log(`Appointment create error:`, e);
        }
    };

    const onSubmit = (formValues) => {
        const { called_at, appointment_date } = formValues;
        setForm(formValues);

        if (called_at === appointment_date) {
            setShowConfirmationModal(true);
        } else {
            submitSchedule(formValues);
        }
    };

    const handleReschedule = async (formValues) => {
        const submissionValue = {
            ...formValues,
            ...{
                request_id: id,
                is_cancelled: formValues.is_cancelled !== "Re-Schedule",
                is_scheduled: formValues.is_scheduled === "Yes",
                timeZone,
            },
        };

        try {
            await fireRescheduleSubmit({ params: submissionValue });
            refreshAssessment("schedule");
        } catch (e) {
            console.log(`Appointment re-create error:`, e);
        }
    };

    return (
        <>
            <ConfirmationModal
                showModal={showConfirmationModal}
                content="Appointment Date and Called Date are the same, are you sure?"
                handleAction={() => submitSchedule(form)}
                handleCancel={() => setShowConfirmationModal(false)}
            />

            <Card className="border-1 border-top-0 border-end-0 border-start-0 bg-light mb-3">
                <Card.Header className="bg-light border-0 ps-0">
                    <div className="d-flex">
                        <div>
                            <h5>
                                <FapIcon
                                    icon="check-circle"
                                    type="fas"
                                    className={`text-success ms-n3 me-1${
                                        valid ? "" : " invisible"
                                    }`}
                                />
                                Schedule Member
                            </h5>
                        </div>
                        <div className="ms-auto">
                            {!openSchedule && data?.status !== "On Hold" && (
                                <Button
                                    variant="link"
                                    onClick={toggleOpenSchedule}
                                >
                                    {data?.called_date && data?.appointment_date
                                        ? `change`
                                        : `schedule`}
                                </Button>
                            )}
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Collapse in={openSchedule}>
                        <div>
                            {data?.called_date && data?.appointment_date ? (
                                <div>
                                    {rescheduleFormError && (
                                        <PageAlert
                                            variant="warning"
                                            dismissible
                                            timeout={6000}
                                        >
                                            {rescheduleFormError}
                                        </PageAlert>
                                    )}

                                    <LoadingOverlay
                                        active={
                                            rescheduleLoading || refreshLoading
                                        }
                                        spinner
                                        text="Processing..."
                                        styles={{
                                            overlay: (base) => ({
                                                ...base,
                                                borderRadius: "12px",
                                            }),
                                        }}
                                    >
                                        <Form
                                            defaultData={defaultRescheduleData}
                                            onSubmit={handleReschedule}
                                        >
                                            <RescheduleForm
                                                reasonOptions={reasonOptions}
                                            />

                                            <Row>
                                                <Col>
                                                    <Button
                                                        variant="secondary"
                                                        onClick={
                                                            toggleOpenSchedule
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
                                    </LoadingOverlay>
                                </div>
                            ) : (
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
                                        active={loading || refreshLoading}
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
                                                        reasonOptions={
                                                            reasonOptions
                                                        }
                                                    />

                                                    <Row>
                                                        <Col>
                                                            <Button
                                                                variant="secondary"
                                                                onClick={
                                                                    toggleOpenSchedule
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
                            )}
                        </div>
                    </Collapse>
                    <Collapse in={!openSchedule}>
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
                                            <p
                                                className={
                                                    data?.status === "On Hold"
                                                        ? "text-danger"
                                                        : ""
                                                }
                                            >
                                                {data?.status === "On Hold"
                                                    ? data?.status
                                                    : (!!data?.appointment_date &&
                                                          `${
                                                              data.appointment_date
                                                          } ${fromUtcTime(
                                                              data?.appt_window
                                                                  ?.start
                                                          )} -
                                                          ${fromUtcTime(
                                                              data?.appt_window
                                                                  ?.end,
                                                              timeZoneName
                                                          )}`) ||
                                                      "n/a"}
                                            </p>
                                        </>
                                    ) : (
                                        <Button
                                            variant="link"
                                            className="fst-italic p-0"
                                            onClick={toggleOpenSchedule}
                                        >
                                            . Schedule Appointment
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

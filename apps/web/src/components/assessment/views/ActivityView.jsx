import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Collapse, Row, Col } from "react-bootstrap";
import LoadingOverlay from "react-loading-overlay";

import ActivityForm from "../forms/ActivityForm";
import AddActivityForm from "../forms/AddActivityForm";

import Form from "components/elements/Form";
import FapIcon from "components/elements/FapIcon";
import PageAlert from "components/elements/PageAlert";

import useApiCall from "hooks/useApiCall";

import "./styles.scss";

const ActivityView = ({
    openActivity,
    toggleOpenActivity,
    activities,
    refreshAssessment,
    refreshLoading,
}) => {
    const { id, request_id } = useParams(); // If request_id, request form, if id, assessment form

    const [{ loading, error: formError }, fireSubmit] = useApiCall({
        method: "post",
        url: "/activity",
    });

    const [defaultData] = useState({
        priority: false,
        message: "",
    });

    const onSubmit = async (formValues) => {
        const submissionValue = {
            ...formValues,
            ...{
                request_id: request_id ? request_id : id,
            },
        };

        try {
            await fireSubmit({ params: submissionValue });
            refreshAssessment("activity");
        } catch (e) {
            console.log(`Activity create error:`, e);
        }
    };

    return (
        <>
            <Card
                className={`border-1 border-top-0 border-end-0 border-start-0 bg-light ${
                    request_id ? "mt-3" : "mb-3"
                }`}
            >
                <Card.Header className="bg-light border-0 ps-2">
                    <div className="d-flex">
                        <div>
                            {request_id ? (
                                <h5>
                                    <FapIcon
                                        icon="check-circle"
                                        type="fas"
                                        className="text-success me-3"
                                    />
                                    Activities
                                </h5>
                            ) : (
                                <h5 className="ms-2">Activities</h5>
                            )}
                        </div>
                        <div className="ms-auto">
                            {!openActivity && (
                                <Button
                                    variant="link"
                                    onClick={toggleOpenActivity}
                                >
                                    add activity
                                </Button>
                            )}
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Collapse in={openActivity}>
                        <div>
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
                                <Form
                                    defaultData={defaultData}
                                    onSubmit={onSubmit}
                                >
                                    <AddActivityForm />

                                    <Row>
                                        <Col>
                                            <Button
                                                variant="secondary"
                                                onClick={toggleOpenActivity}
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
                    </Collapse>
                    <Collapse in={!openActivity}>
                        <div>
                            <ActivityForm
                                items={activities}
                                expanderOpen={
                                    <FapIcon icon="folder-minus" size="1x" />
                                }
                                expanderClosed={
                                    <FapIcon icon="folder-plus" size="1x" />
                                }
                            />
                        </div>
                    </Collapse>
                </Card.Body>
            </Card>
        </>
    );
};

export default ActivityView;

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Container, Alert } from "react-bootstrap";

import PageLayout from "layouts/PageLayout";

import PageTitle from "components/PageTitle";
import AssessmentEditForm from "components/assessment/AssessmentEditForm";

import useApiCall from "hooks/useApiCall";

const Assessment = (props) => {
    const { id } = useParams();

    const [
        {
            loading,
            data: { questionnaire, answers },
            error,
        },
        fireLoadAssessment,
    ] = useApiCall();

    useEffect(() => {
        fireLoadAssessment({
            url: `/assessment/${id}`,
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleBack = () => {
        props.history.push("/");
    };

    return (
        <PageLayout>
            <Container fluid>
                <Row className="justify-content-lg-center">
                    <Col xl={10}>
                        <PageTitle title="Assessment" onBack={handleBack} />
                    </Col>
                </Row>

                <Row className="justify-content-lg-center">
                    <Col xl={10}>
                        <Alert variant="success" className="px-4 py-3">
                            <div className="d-flex align-items-center w-100">
                                <div>
                                    <h5 className="mb-0">Alexander King</h5>
                                    <h5 className="mb-0">
                                        311 Hope St Mountain View, CA 94040
                                    </h5>
                                    <h5 className="mb-0">555-555-5555</h5>
                                </div>
                                <div className="ms-auto">
                                    <p className="fs-7 mb-2 text-muted">
                                        Date of Birth
                                    </p>
                                    <h6 className="mb-0">10/06/1939</h6>
                                </div>
                            </div>
                        </Alert>
                    </Col>
                </Row>

                <AssessmentEditForm />
            </Container>
        </PageLayout>
    );
};

export default Assessment;

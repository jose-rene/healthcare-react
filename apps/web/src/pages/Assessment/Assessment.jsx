import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Container, Alert } from "react-bootstrap";

import PageLayout from "layouts/PageLayout";

import PageTitle from "components/PageTitle";
import AssessmentEditForm from "components/assessment/AssessmentEditForm";

import useApiCall from "hooks/useApiCall";

const Assessment = (props) => {
    const { id } = useParams();

    const [{ data }, fireLoadAssessment] = useApiCall();

    useEffect(() => {
        fireLoadAssessment({
            url: `/assessment/${id}`,
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const reasonOptions = useMemo(() => {
        const { appt_reasons } = data;
        if (!appt_reasons) {
            return [];
        }

        const result = [{ id: "", title: "", val: "" }];
        appt_reasons.forEach((reason) => {
            result.push({ id: reason, title: reason, val: reason });
        });

        return result;
    }, [data]);

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
                                    <h5 className="mb-0">
                                        {data?.member?.name}
                                    </h5>
                                    <h5 className="mb-0">
                                        {data?.member?.address?.address_1}{" "}
                                        {data?.member?.address?.city}
                                        {data?.member && ","}{" "}
                                        {data?.member?.address?.state}{" "}
                                        {data?.member?.address?.postal_code}
                                    </h5>
                                    <h5 className="mb-0">
                                        {data?.member?.phone?.number}
                                    </h5>
                                </div>
                                <div className="ms-auto">
                                    <p className="fs-7 mb-2 text-muted">
                                        Date of Birth
                                    </p>
                                    <h6 className="mb-0">
                                        {data?.member?.dob}
                                    </h6>
                                </div>
                            </div>
                        </Alert>
                    </Col>
                </Row>

                <AssessmentEditForm reasonOptions={reasonOptions} data={data} />
            </Container>
        </PageLayout>
    );
};

export default Assessment;

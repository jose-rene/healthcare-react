import React, { useEffect, useMemo, useState } from "react";
import { Alert, Container, Row, Col } from "react-bootstrap";

import PageLayout from "layouts/PageLayout";

import { useUser } from "Context/UserContext";

import PageTitle from "components/PageTitle";
import RequestEditForm from "components/request/RequestEditForm";
import FapIcon from "components/elements/FapIcon";
import PageAlert from "components/elements/PageAlert";

import useApiCall from "hooks/useApiCall";

/* eslint-disable react-hooks/exhaustive-deps */

const RequestEdit = ({
    match: {
        params: { id },
    },
    history,
}) => {
    const { userIs } = useUser();

    const [request, setRequest] = useState({ id: null });
    const [{ loading = true, error }, fireLoadRequest] = useApiCall({
        url: `/request/${id}`,
    });

    useEffect(() => {
        (async () => {
            try {
                const result = await fireLoadRequest();
                setRequest(result);
            } catch (e) {
                console.log("e:", e);
            }
        })();
    }, []);

    const { member = {} } = request;

    const [name, dob] = useMemo(() => {
        const {
            title = "",
            last_name = "",
            first_name = "",
            dob = "",
        } = member || {};

        return [`${title} ${first_name} ${last_name}`, dob];
    }, [member]);
    return (
        <PageLayout>
            <Container fluid>
                <Row className="justify-content-lg-center">
                    <Col xl={10}>
                        <PageTitle
                            title={
                                request?.auth_number
                                    ? `Request ${request.auth_number}`
                                    : "View Request"
                            }
                            backLink={
                                userIs("client_services_specialist")
                                    ? "/dashboard"
                                    : "/healthplan/start-request"
                            }
                        />
                    </Col>
                </Row>
                <Row className="justify-content-lg-center">
                    <Col xl={10}>
                        <Alert variant="success" className="px-4 py-3">
                            <div className="d-flex align-items-center w-100">
                                <div>
                                    <h5 className="mb-0">{name}</h5>
                                </div>
                                <div className="ms-auto">
                                    <p className="fs-7 mb-2 text-muted">
                                        Date of Birth
                                    </p>
                                    <h6 className="mb-0">{dob}</h6>
                                </div>
                            </div>
                        </Alert>
                    </Col>
                </Row>
                {error && (
                    <Row className="justify-content-lg-center">
                        <Col xl={10}>
                            <PageAlert variant="warning">{error}</PageAlert>
                        </Col>
                    </Row>
                )}
                {!loading && request?.id ? (
                    <RequestEditForm data={request} />
                ) : (
                    !error && (
                        <Row className="justify-content-lg-center">
                            <Col xl={10}>
                                <div className="text-center">
                                    <FapIcon icon="spinner" size="2x" />
                                    <span className="ms-2 align-middle">
                                        Loading...
                                    </span>
                                </div>
                            </Col>
                        </Row>
                    )
                )}
            </Container>
        </PageLayout>
    );
};
export default RequestEdit;

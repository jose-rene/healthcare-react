import React, { useEffect, useMemo } from "react";
import { Alert, Container, Row, Col } from "react-bootstrap";
import PageTitle from "components/PageTitle";
import RequestForm from "components/request/RequestForm";
import FapIcon from "components/elements/FapIcon";
import PageLayout from "../../layouts/PageLayout";
import useApiCall from "../../hooks/useApiCall";
import { POST } from "../../config/URLs";
import useToast from "../../hooks/useToast";
/* eslint-disable react-hooks/exhaustive-deps */

const NewRequestAdd = ({
    match: {
        params: { member_id, request_id = false },
    },
    history,
}) => {
    const { error: errorMessage } = useToast();
    const [{ loading: saving = true }, fireCreateRequest] = useApiCall({
        method: POST,
        url: `/member/${member_id}/member-requests`,
    });
    const [{ loading = true, data, error }, fireLoadRequest] = useApiCall();

    const goToSearch = () => {
        if (request_id) {
            if (data.request_status_id === 1) {
                errorMessage("Request has already been submitted");
            } else {
                errorMessage("Request not found");
            }
        } else {
            errorMessage("Member not found");
        }

        history.push({
            pathname: "/healthplan/start-request",
        });
    };

    useEffect(() => {
        (async () => {
            if (!request_id) {
                try {
                    const { id } = await fireCreateRequest();
                    history.push(`/member/${member_id}/request/${id}/edit`);
                } catch (e) {
                    console.log("error creating request:", e);
                    goToSearch();
                }
            }
        })();
    }, []);

    useEffect(() => {
        if (request_id) {
            fireLoadRequest({
                url: `/member/${member_id}/member-requests/${request_id}`,
            });
        }
    }, [request_id]);

    useEffect(() => {
        if (!data?.id && error !== false) {
            goToSearch();
        }

        if (data?.id && data.request_status_id === 1) {
            goToSearch();
        }
    }, [error, data]);

    const { member = {} } = data;

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
                <PageTitle
                    title="New Request"
                    backLink="/healthplan/start-request"
                />
                <Row>
                    <Col lg={8}>
                        <Row>
                            <div className="col-md-12">
                                <Alert variant="green" className="px-4 py-3">
                                    <div className="d-flex w-100">
                                        <div>
                                            <p className="fs-7 mb-2 text-muted">
                                                Patient Identification
                                            </p>
                                            <h6 className="mb-0">{name}</h6>
                                        </div>
                                        <div className="ms-auto">
                                            <p className="fs-7 mb-2 text-muted">
                                                Information
                                            </p>
                                            <h6 className="mb-0">{dob}</h6>
                                        </div>
                                    </div>
                                </Alert>
                                {!loading && data?.id ? (
                                    <RequestForm data={data} />
                                ) : (
                                    <div className="text-center">
                                        <FapIcon icon="spinner" size="2x" />
                                        <span className="ms-2 align-middle">
                                            Loading...
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </PageLayout>
    );
};
export default NewRequestAdd;

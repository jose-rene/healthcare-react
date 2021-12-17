import React, { useEffect, useMemo } from "react";
import { Col, Row } from "react-bootstrap";

import PageLayout from "layouts/PageLayout";

import Form from "components/elements/Form";
import FancyEditor from "components/elements/FancyEditor";
import SubmitButton from "components/elements/SubmitButton";

import useApiCall from "hooks/useApiCall";

import { BASE_URL, PUT } from "config/URLs";

// TODO :: next step in sending/ download the pdf is caching the new template version.
const NarrativeReportPreview = ({
    match: {
        params: { request, template },
    },
}) => {
    const [{ data, loading }, fireLoadRequestTemplate] = useApiCall({
        url: `request/${request}/narrative_report_template/${template}`,
    });

    // eslint-disable-next-line
    const [{ loading: saving }, fireSaveRequest] = useApiCall({
        url: `request/${request}/narrative_report_template/${template}`,
        method: PUT,
    });

    useEffect(() => {
        fireLoadRequestTemplate();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const form = useMemo(() => {
        return {
            templateField: data.template,
        };
    }, [data]);

    const handleFormSubmit = ({ templateField }) => {
        fireSaveRequest({
            params: {
                text: templateField,
            },
        });
    };

    return (
        <PageLayout>
            <h3>Narrative Report</h3>
            <div className="container mt-3">
                <Row>
                    <Col>
                        <Form defaultData={form} onSubmit={handleFormSubmit}>
                            <FancyEditor name="templateField" />
                            <hr />

                            <SubmitButton loading={loading} label="Send" />
                            <a
                                href={`${BASE_URL}/download/report/${template}/request/${request}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={
                                    `btn btn-secondary btn-lg ms-3 ` +
                                    (loading ? "disabled" : "")
                                }
                            >
                                Download PDF
                            </a>
                        </Form>
                    </Col>
                </Row>
            </div>
        </PageLayout>
    );
};

export default NarrativeReportPreview;

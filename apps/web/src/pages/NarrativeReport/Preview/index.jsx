import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import PageLayout from "layouts/PageLayout";

import Form from "components/elements/Form";
import FancyEditor from "components/elements/FancyEditor";
import SubmitButton from "components/elements/SubmitButton";

import useApiCall from "hooks/useApiCall";

import { BASE_URL, PUT } from "config/URLs";

const NarrativeReportPreview = ({
    match: {
        params: { request, template },
    },
}) => {
    const [form, setForm] = useState({});

    const [{ data, loading }, fireLoadRequestTemplate] = useApiCall({
        url: `request/${request}/narrative_report_template/${template}`,
    });

    const [{ loading: saving }, fireSaveRequest] = useApiCall({
        url: `request/${request}/narrative_report_template/${template}`,
        method: PUT,
    });

    useEffect(() => {
        fireLoadRequestTemplate();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setForm(data);
    }, [data]);

    const handleFormSubmit = async (formData) => {
        try {
            const response = await fireSaveRequest({ params: formData });
            const { narrative_report_id } = response || {};

            if (formData.submit === "download_pdf" && narrative_report_id) {
                window.open(
                    `${BASE_URL}/download/report/${narrative_report_id}/modified`,
                    "_blank"
                );
            }
        } catch (e) {
            console.log("err", { e });
        }
    };

    return (
        <PageLayout>
            <h3>Narrative Report</h3>
            <div className="container mt-3">
                <Row>
                    <Col>
                        <Form defaultData={form} onSubmit={handleFormSubmit}>
                            <FancyEditor name="template" />
                            <hr />

                            <SubmitButton
                                loading={loading || saving}
                                label="Save and email"
                                name="submit"
                                value="send"
                            />
                            <SubmitButton
                                className="ms-3"
                                variant="secondary"
                                loading={loading || saving}
                                label="Download PDF"
                                name="submit"
                                value="download_pdf"
                            />
                        </Form>
                    </Col>
                </Row>
            </div>
        </PageLayout>
    );
};

export default NarrativeReportPreview;

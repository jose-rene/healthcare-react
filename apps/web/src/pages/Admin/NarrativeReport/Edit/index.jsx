import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Card } from "react-bootstrap";

import FancyEditor from "components/elements/FancyEditor";
import Form from "components/elements/Form";
import SubmitButton from "components/elements/SubmitButton";
import Textarea from "components/inputs/Textarea";

import { handlebarsTemplate } from "helpers/string";

import useApiCall from "hooks/useApiCall";

import { PUT } from "config/URLs";
import { Link } from "react-router-dom";
import Select from "../../../../components/inputs/Select";

import { get } from "lodash";

const EditNarrativeReport = ({ match }) => {
    const { slug = false } = match.params;

    const [{ loading }, fireLoadTemplate] = useApiCall({
        url: `narrative_report_template/${slug}`,
    });

    const [{ loading: saving }, fireUpdateTemplate] = useApiCall({
        url: `narrative_report_template/${slug}`,
        method: PUT,
    });

    const [{ data: { data: reports = [] }, loading: loadingReports }, fireLoadReports] = useApiCall({
        url: `request`,
    });

    const [form, setForm] = useState({
        templateField: ``,
    });

    const [answerData, setAnswerData] = useState(null);

    const [selectedReport, setSelectedReport] = useState(null);

    const handleFormSubmit = (formValues) => {
        const { templateField: template = "" } = formValues;
        setForm(formValues);
        fireUpdateTemplate({ params: { template } });
    };

    useEffect(() => {
        fireLoadReports();

        (async () => {
            const { template = "" } = await fireLoadTemplate().catch(() => {});
            setForm({ templateField: template });
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelectedReport = (e) => {
        const { value } = e.target || {};
        const _selectedReport = reports.find(({ id }) => id === value);

        setSelectedReport(value);
        setAnswerData(JSON.stringify(_selectedReport, null, 2));
    };

    const answerObj = useMemo(() => {
        try {
            return JSON.parse(answerData);
        } catch (e) {
            return {};
        }
    }, [answerData]);

    return loading ? null : (
        <div>
            <Row>
                <Col>
                    <Form defaultData={form} onSubmit={handleFormSubmit}>
                        <FancyEditor name="templateField" />
                        <hr />
                        <SubmitButton loading={saving} />
                        {selectedReport && (
                            <Link
                                className="btn btn-primary btn-lg ms-3"
                                to={`/request/${selectedReport}/template/${slug}`}
                            >
                                Email PDF report id {selectedReport}
                            </Link>
                        )}
                    </Form>
                </Col>
                <Col>
                    <Select
                        name="selectedReport"
                        label="Reports"
                        addEmpty
                        onChange={handleSelectedReport}
                        value={selectedReport}
                        labelKey="label"
                        valueKey="value"
                        options={reports.map(r => ({
                            value: r.id,
                            label: `Member Name: ${get(r, "member.name")} Request Date: ${r.request_date}`,
                        }))}
                    />
                    <Textarea
                        label="Answer data"
                        name="answer_data"
                        style={{ height: 200 }}
                        value={answerData}
                        onChange={({ target: { value } }) =>
                            setAnswerData(value)
                        }
                    />
                    <hr />
                    <h3>Preview</h3>
                    {form.templateField && (
                        <Card>
                            <Card.Body
                                dangerouslySetInnerHTML={{
                                    __html: handlebarsTemplate(
                                        form.templateField,
                                        answerObj,
                                    ),
                                }}
                            />
                        </Card>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default EditNarrativeReport;

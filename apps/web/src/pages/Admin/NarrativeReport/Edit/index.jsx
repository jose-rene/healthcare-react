import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Card } from "react-bootstrap";

import FancyEditor from "components/elements/FancyEditor";
import Form from "components/elements/Form";
import SubmitButton from "components/elements/SubmitButton";
import Textarea from "components/inputs/Textarea";

import { handlebarsTemplate } from "helpers/string";

import useApiCall from "hooks/useApiCall";

import { PUT } from "config/URLs";

const EditNarrativeReport = ({ match }) => {
    const { slug = false } = match.params;

    const [{ loading }, fireLoadTemplate] = useApiCall({
        url: `narrative_report_template/${slug}`,
    });

    const [{ loading: saving }, fireUpdateTemplate] = useApiCall({
        url: `narrative_report_template/${slug}`,
        method: PUT,
    });

    const [form, setForm] = useState({
        templateField: ``,
    });
    const [answerData, setAnswerData] = useState(
        '{"first_name": "test first name", "people": [{"name": "foo", "age": 21}, {"name": "bar"}]}'
    );

    const handleFormSubmit = (formValues) => {
        const { templateField: template = "" } = formValues;
        setForm(formValues);
        fireUpdateTemplate({ params: { template } });
    };

    useEffect(() => {
        (async () => {
            const { template = "" } = await fireLoadTemplate().catch(() => {});
            setForm({ templateField: template });
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                    </Form>
                </Col>
                <Col>
                    <Textarea
                        value={answerData}
                        onChange={({ target: { value } }) =>
                            setAnswerData(value)
                        }
                        label="Answer data"
                    />
                    <hr />
                    <h3>Preview</h3>
                    {form.templateField && (
                        <Card>
                            <Card.Body
                                dangerouslySetInnerHTML={{
                                    __html: handlebarsTemplate(
                                        form.templateField,
                                        answerObj
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

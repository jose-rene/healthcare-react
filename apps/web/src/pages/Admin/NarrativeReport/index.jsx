import React, { useState, useEffect, useMemo } from "react";
import FancyEditor from "components/elements/FancyEditor";
import Form from "components/elements/Form";
import SubmitButton from "components/elements/SubmitButton";
import { Row, Col, Card } from "react-bootstrap";
import Textarea from "components/inputs/Textarea";
import { handlebarsTemplate } from "helpers/string";

const NarrativeReport = () => {
    const [form, setForm] = useState({
        testField: `<p>Welcome <strong>{{first_name}}</strong>.</p>
<ul>{{#each people}}
<li>Welcome <span style="background-color: #7e8c8d;">{{name}}</span></li>
{{/each}}</ul>
<h2>Ok Thank you {{first_name}}</h2>`,
    });
    const [answerData, setAnswerData] = useState(
        "{\"first_name\": \"test first name\", \"people\": [{\"name\": \"foo\"}, {\"name\": \"bar\"}]}");

    const handleFormSubmit = (formValues) => {
        setForm(formValues);
    };

    useEffect(() => {
        try {
            console.log({ answerData: JSON.parse(answerData) });
        } catch (e) {}
    }, [answerData]);

    const answerObj = useMemo(() => {
        try {
            return JSON.parse(answerData);
        } catch (e) {
            return {};
        }
    }, [answerData]);

    return (
        <div>
            FancyEditor Page:
            <Row>
                <Col>
                    <Form defaultData={form} onSubmit={handleFormSubmit}>
                        <FancyEditor name="testField" />
                        <hr />
                        <SubmitButton />
                    </Form>
                </Col>
                <Col>
                    <Textarea
                        value={answerData}
                        onChange={({ target: { value } }) => setAnswerData(value)}
                        //onBlue={handleAnswerOutput}
                        label="Answer data"
                    />
                    <hr />
                    <h3>Preview</h3>
                    {form.testField && (
                        <Card>
                            <Card.Body
                                dangerouslySetInnerHTML={{
                                    __html: handlebarsTemplate(form.testField, answerObj),
                                }}
                            />
                        </Card>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default NarrativeReport;

import React, { useEffect } from "react";
import { Col, Card, Row } from "react-bootstrap";
import ContextInput from "../../../../components/inputs/ContextInput";
import FancyEditor from "../../../../components/elements/FancyEditor";
import SubmitButton from "../../../../components/elements/SubmitButton";
import { Link } from "react-router-dom";
import { get } from "lodash";
import { handlebarsTemplate } from "../../../../helpers/string";
import Select from "../../../../components/contextInputs/Select";
import { useFormContext } from "../../../../Context/FormContext";

const NarrativeReportEditorForm = ({
    saving = false,
    slug,
    reports = [],
    handleSelectedReport,
}) => {
    const { update, form, addPreSubmitCallback } = useFormContext();

    const {
        styles = "",
        test_json = "",
        template = "",
        selectedReport = "",
    } = form || {};

    useEffect(() => {
        addPreSubmitCallback(({ form: cleanForm }) => {
            return { ...cleanForm, test_json: JSON.parse(cleanForm.test_json) };
        });
    }, []);

    useEffect(() => {
        const reportIndex = reports.findIndex((r) => r.id === selectedReport);
        update("test_json", JSON.stringify(reports[reportIndex], null, 2));
    }, [selectedReport]);

    return (
        <Row>
            <Col>
                <ContextInput
                    type="textarea"
                    label="Styles"
                    name="styles"
                    style={{ height: "5rem" }}
                    placeholder="p{ background: yellow; margin: 3px;}"
                    help={`Be careful the styles registered here can effect the site.
                            If you prefix the class with an underscore or something you should be ok.`}
                />
                <FancyEditor name="template" />
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
                {test_json && !selectedReport && (
                    <Link
                        className="btn btn-primary btn-lg ms-3"
                        to={`/request/no_report_test_json/template/${slug}`}
                    >
                        Email PDF with test json data
                    </Link>
                )}
            </Col>
            <Col>
                <Select
                    name="selectedReport"
                    label="Reports"
                    addEmpty
                    labelKey="label"
                    valueKey="value"
                    options={reports.map((r) => {
                        const { id, request_date } = r || {};

                        return {
                            value: id,
                            label: `Member Name: ${get(
                                r,
                                "member.name"
                            )} Request Date: ${request_date}`,
                        };
                    })}
                    onChange={handleSelectedReport}
                />
                <ContextInput
                    type="textarea"
                    label="Answer data"
                    name="test_json"
                    style={{ height: 200 }}
                />
                <hr />
                <h3>Preview</h3>
                {template && (
                    <Card>
                        {styles && <style>{styles}</style>}
                        <Card.Body
                            dangerouslySetInnerHTML={{
                                __html: handlebarsTemplate(template, test_json),
                            }}
                        />
                    </Card>
                )}
            </Col>
        </Row>
    );
};

export default NarrativeReportEditorForm;

import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";

import Select from "components/inputs/Select";
import InputText from "components/inputs/InputText";
import TableAPI from "components/elements/TableAPI";

const testData = [
    {
        guideline: "calopt guideline",
        category: "home safety",
        criteriaType: "Cursus nisl tortoro enim amet.",
        criteria: "Aliquet a ut volutpat aliquet.",
    },
];

const TabCriteria = () => {
    const [headers] = useState([
        {
            columnMap: "guideline",
            label: "Guideline",
            type: String,
            disableSortBy: true,
            formatter(guideline) {
                return (
                    <Select
                        defaultValue={guideline}
                        options={[
                            {
                                id: "calopt guideline",
                                val: "calopt guideline",
                                title: "Calopt Guideline",
                            },
                            {
                                id: "option1",
                                val: "option1",
                                title: "Option 1",
                            },
                            {
                                id: "option2",
                                val: "option2",
                                title: "Option 2",
                            },
                        ]}
                    />
                );
            },
        },
        {
            columnMap: "category",
            label: "Category",
            type: String,
            disableSortBy: true,
            formatter(category) {
                return (
                    <Select
                        defaultValue={category}
                        options={[
                            {
                                id: "home safety",
                                val: "home safety",
                                title: "Home Safety",
                            },
                            {
                                id: "option1",
                                val: "option1",
                                title: "Option 1",
                            },
                            {
                                id: "option2",
                                val: "option2",
                                title: "Option 2",
                            },
                        ]}
                    />
                );
            },
        },
        {
            columnMap: "criteriaType",
            label: "Critea Type",
            type: String,
            disableSortBy: true,
            formatter(criteriaType) {
                return <InputText value={criteriaType} />;
            },
        },
        {
            columnMap: "criteria",
            label: "Criteria",
            type: String,
            disableSortBy: true,
            formatter(criteria) {
                return <InputText value={criteria} />;
            },
        },
    ]);

    return (
        <Row className="mt-4">
            <Col md={9}></Col>
            <Col md={3}>
                <Select
                    inlineLabel
                    label="View By Request Type"
                    className="me-2"
                    placeholder="Select"
                    options={[
                        {
                            id: "all",
                            val: "all",
                            title: "All",
                        },
                        {
                            id: "option1",
                            val: "option1",
                            title: "Option 1",
                        },
                        {
                            id: "option2",
                            val: "option2",
                            title: "Option 2",
                        },
                    ]}
                />
            </Col>

            <Col md={12}>
                <TableAPI
                    searchObj={{}}
                    headers={headers}
                    loading={false}
                    data={testData}
                    dataMeta={{}}
                />
            </Col>
        </Row>
    );
};

export default TabCriteria;

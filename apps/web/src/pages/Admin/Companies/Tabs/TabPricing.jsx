import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";

import { Button } from "components";
import InputText from "components/inputs/InputText";
import Select from "components/inputs/Select";
import TableAPI from "components/elements/TableAPI";

const testData = [
    {
        locationAreas: "Placeholder",
        chartReview: "$1000",
        inHomeAssessment: "$1000",
        support: "$1000",
    },
];

const TabPricing = () => {
    const [headers] = useState([
        {
            columnMap: "locationAreas",
            label: "Location Areas",
            type: String,
        },
        {
            columnMap: "chartReview",
            label: "Chart Review",
            type: String,
            formatter(chartReview) {
                return <InputText value={chartReview} />;
            },
        },
        {
            columnMap: "inHomeAssessment",
            label: "In-Home Assessment",
            type: String,
            disableSortBy: true,
            formatter(inHomeAssessment) {
                return <InputText value={inHomeAssessment} />;
            },
        },
        {
            columnMap: "support",
            label: "Support",
            type: String,
            disableSortBy: true,
            formatter(support) {
                return <InputText value={support} />;
            },
        },
    ]);

    return (
        <>
            <Row className="mt-4 d-flex justify-content-end">
                <Col md={3}></Col>
                <Col md={3} className="d-flex justify-content-end">
                    <Select
                        inlineLabel
                        label="Template"
                        placeholder="Select"
                        options={[
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

                    <Button
                        label="Hide Empty"
                        className="mb-3 mx-2"
                        variant="primary"
                    />
                </Col>
                <Col md={3}>
                    <InputText label="No Show Fee" placeholder="$250,00" />
                </Col>
                <Col md={3}>
                    <InputText label="Urgency" placeholder="$250,00" />
                </Col>
            </Row>

            <Row>
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
        </>
    );
};

export default TabPricing;

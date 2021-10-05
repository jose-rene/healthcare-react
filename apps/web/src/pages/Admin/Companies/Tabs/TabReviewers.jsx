import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";

import { Button } from "components";
import TableAPI from "components/elements/TableAPI";
import FapIcon from "components/elements/FapIcon";

import { ACTIONS } from "helpers/table";

const testData = [
    {
        id: "id",
        name: "HealthPlan Of San Mateo",
    },
];

const TabReviewers = () => {
    const [headers] = useState([
        {
            columnMap: "name",
            label: "Name",
            type: String,
        },
        {
            columnMap: "id",
            label: "Actions",
            type: ACTIONS,
            disableSortBy: true,
            formatter(id) {
                return (
                    <>
                        <FapIcon className="mx-1" size="1x" icon="edit" />
                        <FapIcon className="mx-1" size="1x" icon="trash-alt" />
                    </>
                );
            },
        },
    ]);

    return (
        <Row className="mt-4">
            <Col md={6}>
                <Row>
                    <Col md={12} className="d-flex justify-content-between">
                        <h4 className="mt-2">Associated Reviewers</h4>
                        <Button icon="plus" iconSize="sm" label="Add" />
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
            </Col>

            <Col md={6}>
                <Row>
                    <Col md={12} className="d-flex justify-content-between">
                        <h4 className="mt-2">External Abbreviations</h4>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default TabReviewers;

import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";

import { Button } from "components";
import Select from "components/inputs/Select";
import TableAPI from "components/elements/TableAPI";
import FapIcon from "components/elements/FapIcon";

import { ACTIONS } from "helpers/table";

const testData = [
    {
        id: "id",
        filterType: "ZIP Code",
        data: "San Francisco",
    },
];

const GeographicFilters = () => {
    const [headers] = useState([
        {
            columnMap: "filterType",
            label: "Filter Type",
            type: String,
        },
        {
            columnMap: "data",
            label: "Data",
            type: String,
            disableSortBy: true,
        },
        {
            columnMap: "id",
            label: "Actions",
            type: ACTIONS,
            disableSortBy: true,
            formatter(id) {
                return <FapIcon size="1x" icon="trash-alt" />;
            },
        },
    ]);

    return (
        <Row>
            <Col md={12} lg={8} className="mt-4">
                <Row>
                    <Col md={5}>
                        <Select
                            inlineLabel
                            name="filterType"
                            label="Filter Type"
                            options={[
                                {
                                    id: "city",
                                    val: "city",
                                    title: "City",
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

                    <Col md={5}>
                        <Select
                            inlineLabel
                            name="data"
                            label="Data"
                            options={[
                                {
                                    id: "san francisco",
                                    val: "san francisco",
                                    title: "San Francisco",
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

                    <Col md={2}>
                        <Button icon="plus" iconSize="sm" label="Add" block />
                    </Col>
                </Row>
            </Col>

            <Col md={12} lg={8} className="mt-5">
                <h4>Geographic Filters</h4>
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

export default GeographicFilters;

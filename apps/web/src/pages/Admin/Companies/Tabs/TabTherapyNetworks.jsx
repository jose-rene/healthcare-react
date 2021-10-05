import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";

import TableAPI from "components/elements/TableAPI";

import { ACTIONS } from "helpers/table";

const testData = [{ company: "DME Consulting, Inc" }];

const TabTherapyNetwork = () => {
    const [headers] = useState([
        {
            columnMap: "company",
            label: "Company",
            type: ACTIONS,
            disableSortBy: true,
        },
    ]);

    return (
        <Row className="mt-4">
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

export default TabTherapyNetwork;

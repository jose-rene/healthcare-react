import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

import PageLayout from "layouts/PageLayout";

import PageTitle from "components/PageTitle";
import TableAPI from "components/elements/TableAPI";

import { ACTIONS } from "helpers/table";

const Invoices = () => {
    const [headers] = useState([
        {
            columnMap: "invoice",
            label: "Invoice",
            type: String,
            disableSortBy: true,
        },
        {
            label: "Actions",
            columnMap: "id",
            type: ACTIONS,
            disableSortBy: true,
            formatter() {
                return <></>;
            },
        },
    ]);

    const [loading] = useState(false);

    return (
        <PageLayout>
            <Container fluid>
                <PageTitle title="Invoices" hideBack />

                <Row>
                    <Col>
                        <TableAPI
                            searchObj={{}}
                            headers={headers}
                            loading={loading}
                            data={[]}
                            dataMeta={{}}
                        />
                    </Col>
                </Row>
            </Container>
        </PageLayout>
    );
};

export default Invoices;

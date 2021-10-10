import React from "react";
import { Col, Row, Container } from "react-bootstrap";

import PageLayout from "layouts/PageLayout";

import { useUser } from "Context/UserContext";

import BroadcastAlert from "components/elements/BroadcastAlert";
import RequestInfo from "components/elements/RequestInfo";
import RequestsTable from "components/elements/RequestsTable";

import "styles/home.scss";
import RequestForms from "../../components/elements/RequestForms";

const Home = () => {
    const { getUser } = useUser();
    const { first_name, last_name } = getUser();

    const primary_name = first_name ?? last_name;

    return (
        <PageLayout>
            <Container fluid>
                <Row>
                    <Col>
                        <BroadcastAlert />
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <h2>Hi {primary_name}</h2>

                        <RequestInfo />

                        <RequestsTable />

                        <RequestForms />
                    </Col>
                </Row>
            </Container>
        </PageLayout>
    );
};

export default Home;

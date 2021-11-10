import React from "react";
import { Row, Col, Container } from "react-bootstrap";

import PageLayout from "layouts/PageLayout";

import { useUser } from "Context/UserContext";

import BroadcastAlert from "components/elements/BroadcastAlert";
import RequestsTable from "components/elements/RequestsTable";
import RequestInfo from "components/elements/RequestInfo";

import "styles/home.scss";

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
                    </Col>
                </Row>
            </Container>
        </PageLayout>
    );
};

export default Home;

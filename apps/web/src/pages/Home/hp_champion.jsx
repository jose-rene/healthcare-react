import React from "react";
import { Col, Row, Button, Container } from "react-bootstrap";

import PageLayout from "layouts/PageLayout";

import { useUser } from "Context/UserContext";

import BroadcastAlert from "components/elements/BroadcastAlert";
import RequestInfo from "components/elements/RequestInfo";
import UserList from "components/elements/UserList";
import FapIcon from "components/elements/FapIcon";
import RequestsTable from "components/elements/RequestsTable";

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

                        <div className="d-flex mt-4">
                            <h3>
                                Users
                                <Button
                                    variant="link"
                                    href="/healthplan/adduser"
                                    className="py-1 ms-2"
                                >
                                    <FapIcon icon="plus" />
                                    Add New
                                </Button>
                            </h3>
                        </div>
                        <UserList />
                    </Col>
                </Row>
            </Container>
        </PageLayout>
    );
};

export default Home;

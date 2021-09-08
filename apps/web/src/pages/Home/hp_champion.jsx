import React from "react";
import { Col, Row, Button, Container } from "react-bootstrap";

import BroadcastAlert from "components/elements/BroadcastAlert";
import RequestInfo from "components/elements/RequestInfo";
import UserList from "components/elements/UserList";
import FapIcon from "components/elements/FapIcon";
import PageLayout from "../../layouts/PageLayout";
import "../../styles/home.scss";

const Home = () => {
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
                        <h1>Welcome to your Portal</h1>

                        <RequestInfo />

                        <div className="d-flex">
                            <h2>
                                Users
                                <Button
                                    variant="link"
                                    href="/healthplan/adduser"
                                    className="py-1 ms-2"
                                >
                                    <FapIcon icon="plus" />
                                    Add New
                                </Button>
                            </h2>
                        </div>
                        <UserList />
                    </Col>
                </Row>
            </Container>
        </PageLayout>
    );
};

export default Home;

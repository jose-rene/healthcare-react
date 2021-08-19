import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import BroadcastAlert from "components/elements/BroadcastAlert";
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
                        <h3>Health Plan Finance User Dashboard</h3>
                    </Col>
                </Row>
            </Container>
        </PageLayout>
    );
};

export default Home;

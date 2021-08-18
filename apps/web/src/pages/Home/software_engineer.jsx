import React from "react";
import { Row, Col } from "react-bootstrap";
import BroadcastAlert from "components/elements/BroadcastAlert";
import PageLayout from "../../layouts/PageLayout";
import "../../styles/home.scss";

const Home = () => {
    return (
        <PageLayout>
            <BroadcastAlert />
            <Row>
                <Col md={12}>
                    <h1>Welcome to your Portal</h1>
                    <h3>Software Engineering Dashboard</h3>
                </Col>
            </Row>
        </PageLayout>
    );
};

export default Home;

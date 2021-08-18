import React from "react";
import { Col, Row, Button } from "react-bootstrap";

import BroadcastAlert from "components/elements/BroadcastAlert";
import RequestInfo from "components/elements/RequestInfo";
import UserList from "components/elements/UserList";
import PageLayout from "../../layouts/PageLayout";
import "../../styles/home.scss";
import FapIcon from "components/elements/FapIcon";

const Home = () => {
    return (
        <PageLayout>
            <BroadcastAlert />
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
                                className="py-1 ml-2"
                            >
                                <FapIcon icon="plus" />
                                Add New
                            </Button>
                        </h2>
                    </div>
                    <UserList />
                </Col>
            </Row>
        </PageLayout>
    );
};

export default Home;

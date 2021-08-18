import React from "react";
import { Row } from "react-bootstrap";
import { Button } from "components";
import BroadcastAlert from "components/elements/BroadcastAlert";
import RequestInfo from "components/elements/RequestInfo";
import UserList from "components/elements/UserList";
import PageLayout from "../../layouts/PageLayout";
import "../../styles/home.scss";

const Home = () => {
    return (
        <PageLayout>
            <BroadcastAlert />
            <div className="content-box">
                <Row>
                    <div className="col-md-12">
                        <h1 className="box-title">Welcome to your Portal</h1>

                        <RequestInfo />

                        <div className="box-same-line">
                            <h1 className="box-subtitle">
                                Users
                                <Button
                                    useButton={false}
                                    to="/healthplan/adduser"
                                    className="py-1 ml-2"
                                    icon="plus"
                                    iconSize="sm"
                                >
                                    Add New
                                </Button>
                            </h1>

                            <div className="d-block d-sm-none">
                                <div className="box-filters">
                                    <p className="text-filters">Filters</p>

                                    <img alt="" src="/icons/filter.png" />
                                </div>
                            </div>
                        </div>
                        <UserList />
                    </div>
                </Row>
            </div>
        </PageLayout>
    );
};

export default Home;

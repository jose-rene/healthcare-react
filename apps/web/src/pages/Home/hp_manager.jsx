import React from "react";
import { Row } from "react-bootstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../../components/inputs/Button";
import AlertList from "../../components/elements/AlertList";
import BroadcastAlert from "../../components/elements/BroadcastAlert";
import RequestInfo from "../../components/elements/RequesInfo";
import UserList from "../../components/elements/UserList";
import PageLayout from "../../layouts/PageLayout";
import "../../styles/home.scss";

const Home = ({ email, full_name }) => {
    return (
        <PageLayout>
            <BroadcastAlert />
            <div className="content-box">
                <Row>
                    <div className="col-lg-8">
                        <h1 className="box-title">Welcome to your Portal</h1>

                        <RequestInfo />

                        <div className="box-same-line">
                            <h1 className="box-subtitle">
                                Users{" "}
                                <Link to="hp_add_user">
                                    <Button
                                        className="py-1 ml-2"
                                        icon="plus"
                                        iconSize="sm"
                                    >
                                        Add New
                                    </Button>
                                </Link>
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
                    <div className="col-lg-4 mt-4 mt-lg-0">
                        <AlertList />
                    </div>
                </Row>
            </div>
        </PageLayout>
    );
};

const mapStateToProps = ({ user: { email, full_name } }) => ({
    email,
    full_name,
});

export default connect(mapStateToProps)(Home);

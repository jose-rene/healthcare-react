import React from "react";
import { Row } from "react-bootstrap";
import { connect } from "react-redux";
import AlertList from "components/elements/AlertList";
import BroadcastAlert from "components/elements/BroadcastAlert";
import RequestInfo from "components/elements/RequestInfo";
import RequestList from "components/elements/RequestList";
import PageLayout from "../../layouts/PageLayout";
import "../../styles/home.scss";

const DashboardAdmin = () => {
    return (
        <PageLayout>
            <BroadcastAlert />
            <div className="content-box">
                <Row>
                    <div className="col-lg-8">
                        <h1 className="box-title">
                            Welcome to your Portal (Admin)
                        </h1>

                        <RequestInfo />

                        <div className="box-same-line">
                            <h1 className="box-subtitle">Requests for You</h1>

                            <div className="d-block d-sm-none">
                                <div className="box-filters">
                                    <p className="text-filters">Filters</p>

                                    <img alt="" src="/icons/filter.png" />
                                </div>
                            </div>
                        </div>
                        <RequestList />
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

export default connect(mapStateToProps)(DashboardAdmin);

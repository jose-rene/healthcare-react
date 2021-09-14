import React from "react";
import { Row } from "react-bootstrap";

import PageLayout from "layouts/PageLayout";

import { useUser } from "Context/UserContext";

import AlertList from "components/elements/AlertList";
import BroadcastAlert from "components/elements/BroadcastAlert";
import RequestInfo from "components/elements/RequestInfo";
import RequestList from "components/elements/RequestList";

import "styles/home.scss";

const Index = () => {
    const { getUser } = useUser();
    const { first_name, last_name } = getUser();

    const primary_name = first_name ?? last_name;

    return (
        <PageLayout>
            <BroadcastAlert />
            <div className="content-box">
                <Row>
                    <div className="col-lg-8">
                        <h2 className="box-title">Hi {primary_name}</h2>

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

export default Index;

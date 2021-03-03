import React from "react";
import { Row } from "react-bootstrap";
import AlertList from "../../components/elements/AlertList";
import BroadcastAlert from "../../components/elements/BroadcastAlert";
import PageLayout from "../../layouts/PageLayout";
import "../../styles/home.scss";

const Home = () => {
    return (
        <PageLayout>
            <BroadcastAlert />
            <div className="content-box">
                <Row>
                    <div className="col-lg-8">
                        <h1 className="box-title">Welcome to your Portal</h1>
                        <h3>Software Engineering Dashboard</h3>
                    </div>
                    <div className="col-lg-4 mt-4 mt-lg-0">
                        <AlertList />
                    </div>
                </Row>
            </div>
        </PageLayout>
    );
};

export default Home;

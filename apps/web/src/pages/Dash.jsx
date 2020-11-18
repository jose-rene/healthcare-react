import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Jumbotron } from "react-bootstrap";
import PageLayout from "../layouts/PageLayout";
import logo from "../assets/images/splash.png";

const Dash = ({ email, full_name }) => {
    return (
        <PageLayout>
            <Jumbotron>
                <h1 className="text-center">Dashboard</h1>
                <p className="text-center mt-4">
                    <img src={logo} className="App-logo" alt="logo" />
                </p>
            </Jumbotron>
        </PageLayout>
    );
};

const mapStateToProps = ({ auth, user: { email, full_name } }) => ({
    localAuth: auth,
    email,
    full_name,
});

export default connect(mapStateToProps)(Dash);

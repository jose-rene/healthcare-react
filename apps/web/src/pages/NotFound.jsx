import React from "react";
import "../App.css";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageLayout from "../layouts/PageLayout";

const NotFound = () => {
    return (
        <PageLayout>
            <header className="App-header">
                <img src="images/construction.gif" alt="Under Construction" />
            </header>
        </PageLayout>
    );
};

export default NotFound;

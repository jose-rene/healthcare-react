import React from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import InputText from "../../components/inputs/InputText";
import Button from "../../components/inputs/Button";

const TabSecurity = () => {
    return (
        <Row>
            <Col lg={8}>
                <div className="white-box">
                    <Row>
                        <Col lg={12}>
                            <div className="box-same-line">
                                <h2 className="box-inside-title">
                                    Change Password
                                </h2>
                            </div>

                            <p
                                className="box-inside-text"
                                style={{
                                    marginBottom: "32px",
                                    width: "80%",
                                }}
                            >
                                To change your password, enter your current
                                password in the field below and click{" "}
                                <b>Authenticate</b>. After you have
                                authenticated, enter your new password, retype
                                it for it for confirmation and click Change
                                Password.
                            </p>
                        </Col>

                        <Col lg={6}>
                            <InputText
                                type="password"
                                label="Current Password"
                            />
                        </Col>

                        <Col lg={6} />

                        <Col lg={6}>
                            <InputText type="password" label="New Password" />
                        </Col>

                        <Col lg={6} />

                        <Col lg={6}>
                            <InputText
                                type="password"
                                label="Confirm New Password"
                            />
                        </Col>

                        <Col lg={12} style={{ textAlign: "center" }}>
                            <Button label="Cancel" variant="cancel" />
                            <Button label="Change Password" variant="primary" className="ml-3" />
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
    );
};

export default TabSecurity;

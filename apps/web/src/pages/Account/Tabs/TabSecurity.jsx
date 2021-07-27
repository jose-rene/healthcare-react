import React from "react";
import { useForm } from "react-hook-form";
import { Col, Row } from "react-bootstrap";
import InputText from "../../../components/inputs/InputText";
import Button from "../../../components/inputs/Button";

const TabSecurity = ({ currentUser }) => {
    const { email } = currentUser;

    const { errors, register } = useForm();

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
                                name="email"
                                label="Email"
                                type="email"
                                value={email}
                                errors={errors}
                                ref={register({
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message:
                                            "Please enter a valid email address",
                                    },
                                })}
                            />
                        </Col>

                        <Col lg={6} />

                        <Col lg={6}>
                            <InputText
                                type="password"
                                label="Current Password"
                            />
                        </Col>

                        <Col lg={6}>
                            <Button
                                label="Authenticate"
                                outline
                                className="auth-btn mb-md-3 py-2"
                            />
                        </Col>

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
                            <Button
                                label="Change Password"
                                outline
                                className="ml-3"
                            />
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
    );
};

export default TabSecurity;

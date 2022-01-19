import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Container, Row, Col } from "react-bootstrap";
import qs from "query-string";
import * as Yup from "yup";

import Form from "components/elements/Form";
import ContextInput from "components/inputs/ContextInput";
import FapIcon from "components/elements/FapIcon";

import { BASE_URL, POST } from "config/URLs";

import useApiCall from "hooks/useApiCall";

export default ({ location: { search: params = "" } }) => {
    const [{ loading = false }, forgotPassword] = useApiCall({
        baseURL: BASE_URL,
        url: "/password/email/",
        method: POST,
    });

    const validation = {
        email: {
            yupSchema: Yup.string()
                .matches(
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    "Please enter a valid email address"
                )
                .required("Email is required"),
        },
    };

    const { email = "" } = qs.parse(params);
    const [changeSuccess, setChangeSuccess] = useState(false);
    const [passwordChangeError, setPasswordChangeError] = useState(null);
    const [defaultData, setDefaultData] = useState({
        email,
    });

    const handleForgotPassword = async (params) => {
        setDefaultData({ ...defaultData, ...params });
        try {
            setPasswordChangeError(null);
            setChangeSuccess(false);
            await forgotPassword({ params });
            setChangeSuccess(true);
        } catch (e) {
            setChangeSuccess(false);
            const {
                response: { status },
            } = e;
            switch (status) {
                case 422:
                    return setPasswordChangeError(
                        <span>
                            Please check your email or wait a few minutes before
                            re-trying.
                        </span>
                    );

                default:
                    return;
            }
        }
    };

    return (
        <Container fluid>
            <Row>
                <Col md={12} lg={6}>
                    <div className="p-5">
                        <div className="text-center text-lg-left">
                            <Link to="/">
                                <img alt="Logo" src="/images/logo.png" />
                            </Link>
                        </div>

                        <h1 className="sign-in-title">Forgot Password</h1>

                        <Form
                            autocomplete={false}
                            defaultData={defaultData}
                            validation={validation}
                            onSubmit={handleForgotPassword}
                        >
                            <ContextInput label="Email Address" name="email" />
                            <div className="d-flex mt-3">
                                Nevermind
                                <Link
                                    to="/"
                                    className="text-muted ps-1"
                                    tabIndex="-1"
                                >
                                    Sign in
                                </Link>
                            </div>
                            {changeSuccess && (
                                <Alert className="mt-3" variant="success">
                                    <FapIcon icon="email" />
                                    Please check your email for the password
                                    reset instructions.
                                </Alert>
                            )}
                            {passwordChangeError && (
                                <Alert className="mt-3" variant="warning">
                                    {passwordChangeError}
                                </Alert>
                            )}
                            <Button
                                type="submit"
                                variant="primary"
                                title="Sign in"
                                className="p-3 mt-3 w-100"
                                disabled={loading}
                            >
                                Send Reset Password Email
                                {loading ? <FapIcon icon="spinner" /> : null}
                            </Button>
                        </Form>
                    </div>
                </Col>

                <Col
                    lg={6}
                    className="d-none d-sm-none d-md-none d-lg-flex login-bg col-no-padding"
                />
            </Row>
        </Container>
    );
};

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Alert, Container } from "react-bootstrap";

import { useFormContext } from "Context/FormContext";
import ContextInput from "components/inputs/ContextInput";
import SubmitButton from "components/elements/SubmitButton";

const LoginForm = ({
    error,
    action,
    tickClearValidation,
    loading,
    userLoading,
    email,
}) => {
    const { setValidated, getValue } = useFormContext();

    useEffect(() => {
        setValidated(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tickClearValidation]);

    return (
        <Container fluid>
            <Row>
                <div className="col-md-6 pt-5 text-center">
                    <div className="text-center text-lg-left">
                        <img
                            alt="Logo"
                            src="/images/logo-tag-600.png"
                            style={{ maxWidth: "300px" }}
                        />
                    </div>

                    <h2 className="my-4">Sign In</h2>

                    {action && (
                        <Alert className="mt-3" variant="success">
                            Password Updated
                        </Alert>
                    )}
                    <Row>
                        <div className="col-lg-6 offset-lg-3">
                            <ContextInput
                                label="Account"
                                name="email"
                                placeholder="Enter your email address"
                                required
                                large
                            />

                            <ContextInput
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                large
                            />

                            {error && (
                                <Alert className="mt-3" variant="warning">
                                    Error: {error}
                                </Alert>
                            )}

                            <div className="d-flex mt-3">
                                <Link
                                    to={`/password/reset?email=${
                                        getValue("email") || ""
                                    }`}
                                    className="btn-forgot-password"
                                >
                                    Forgot my password
                                </Link>
                                <SubmitButton
                                    title="Sign in"
                                    loading={loading || userLoading}
                                    className="ms-auto"
                                />
                            </div>
                        </div>
                    </Row>
                </div>

                <div className="d-none d-sm-none d-md-block col-md-6 col-no-padding login-bg" />
            </Row>
        </Container>
    );
};

export default LoginForm;

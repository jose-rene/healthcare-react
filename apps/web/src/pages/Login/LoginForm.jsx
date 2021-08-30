import { useFormContext } from "../../Context/FormContext";
import { Row, Alert, Container } from "react-bootstrap";
import ContextInput from "../../components/inputs/ContextInput";
import { Link } from "react-router-dom";
import SubmitButton from "../../components/elements/SubmitButton";
import React, { useEffect } from "react";

const LoginForm = ({
    error,
    action,
    tickClearValidation,
    loading,
    userLoading,
    email,
}) => {
    const { setValidated } = useFormContext();

    useEffect(() => {
        setValidated(false);
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
                                        email.current || ""
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

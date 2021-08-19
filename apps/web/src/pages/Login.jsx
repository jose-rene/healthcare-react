import qs from "query-string";
import React, { useRef, useState } from "react";
import { Alert, Container, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import * as Yup from "yup";
import Form from "components/elements/Form";
import ContextInput from "components/inputs/ContextInput";
import SubmitButton from "components/elements/SubmitButton";
import useAuth from "../hooks/useAuth";
import { initializeUser } from "../actions/userAction";

// this rule wants both the htmlFor and label nested, should be either not both
/* eslint-disable jsx-a11y/label-has-associated-control */

const Login = ({
    authed,
    initializeUser,
    location: { search: params = "" } = {},
}) => {
    // tokenLoading is async storage, loading is http
    const [{ loading, userLoading, error }, { authUser }] = useAuth();
    const { action = false, redirect = "/dashboard" } = qs.parse(params);
    const email = useRef();
    const [loginValues, setLoginValues] = useState({});

    /* useEffect(() => {
        if (authed) {
            history.push(redirect);
        }
    }, [authed]); */

    const validation = {
        email: {
            yupSchema: Yup.string()
                .required("Email is required")
                .email("Please enter a valid email"),
        },
        password: {
            yupSchema: Yup.string()
                .required("Password is required")
                .min(8, "Password must be at least 8 characters"),
        },
    };

    const onSubmit = async (data) => {
        setLoginValues(data);
        if (loading) {
            return false;
        }
        try {
            const { profile } = await authUser(data, { loadProfile: true });
            await initializeUser(profile);
        } catch (e) {
            // setForm({ ...form, email: data?.email ?? "", password: "" });
            console.log("Profile loading error:", e);
        }
    };

    return authed ? (
        <Redirect to={redirect} />
    ) : (
        <Form
            onSubmit={onSubmit}
            validation={validation}
            autocomplete={false}
            defaultData={loginValues}
        >
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

                                {error ? (
                                    <Alert className="mt-3" variant="warning">
                                        Error: {error}
                                    </Alert>
                                ) : null}

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
        </Form>
    );
};

const mapStateToProps = ({ user: { authed } }) => ({
    authed,
});

const mapDispatchToProps = {
    initializeUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

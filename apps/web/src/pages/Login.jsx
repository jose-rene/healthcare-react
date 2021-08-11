import qs from "query-string";
import React, { useRef } from "react";
import { Alert } from "react-bootstrap";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import * as Yup from "yup";
import { initializeUser } from "../actions/userAction";
import useAuth from "../hooks/useAuth";
import Form from "components/elements/Form";
import ContextInput from "components/inputs/ContextInput";
import SubmitButton from "components/elements/SubmitButton";

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
        >
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6 pt-5">
                        <div className="text-center text-lg-left">
                            <img alt="Logo" src="/images/logo.png" />
                        </div>

                        <h1 className="sign-in-title">Sign In</h1>

                        {action && (
                            <Alert className="mt-3" variant="success">
                                Password Updated
                            </Alert>
                        )}

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

                        <div className="mt-3">
                            <Link
                                to={`/password/reset?email=${
                                    email.current || ""
                                }`}
                                className="btn-forgot-password"
                            >
                                Forgot my password
                            </Link>
                        </div>

                        {error ? (
                            <Alert className="mt-3" variant="warning">
                                Error: {error}
                            </Alert>
                        ) : null}

                        <SubmitButton
                            title="Sign in"
                            loading={loading || userLoading}
                        />
                    </div>

                    <div className="d-none d-sm-none d-md-block col-md-6 col-no-padding login-bg" />
                </div>
            </div>
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

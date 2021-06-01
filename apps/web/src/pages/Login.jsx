import qs from "query-string";
import React, { useRef } from "react";
import { Alert, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { initializeUser } from "../actions/userAction";
import Icon from "../components/elements/Icon";
import InputText from "../components/inputs/InputText";
import useAuth from "../hooks/useAuth";

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
    const { register, handleSubmit, errors, watch } = useForm();
    const email = useRef();
    email.current = watch("email");

    const onSubmit = async (data) => {
        if (loading) {
            return false;
        }
        try {
            const { profile } = await authUser(data, { loadProfile: true });
            await initializeUser(profile);
        } catch (e) {
            console.log("Profile loading error:", e);
        }
    };

    return authed ? (
        <Redirect to={redirect} />
    ) : (
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-6 col-no-padding">
                    <div className="container-login">
                        <div className="text-center text-lg-left">
                            <img alt="Logo" src="/images/logo.png" />
                        </div>

                        <h1 className="sign-in-title">Sign In</h1>

                        {action && (
                            <Alert className="mt-3" variant="success">
                                Password Updated
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} method="post">
                            <InputText
                                label="Account"
                                name="email"
                                placeholder="Enter your email address"
                                errors={errors}
                                style={{ height: "56px" }}
                                ref={register({
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message:
                                            "Please enter a valid email address",
                                    },
                                })}
                            />
                            <InputText
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                errors={errors}
                                style={{ height: "56px" }}
                                ref={register({
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message:
                                            "Password must be at least 8 characters",
                                    },
                                    maxLength: {
                                        value: 64,
                                        message:
                                            "Password must be less than 65 characters",
                                    },
                                })}
                            />
                            <div className="d-flex justify-content-between flex-wrap mt-3">
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
                            <Button
                                type="submit"
                                variant="primary"
                                title="Sign in"
                                className="btn-sign-in"
                                disabled={loading || userLoading}
                            >
                                Sign In{" "}
                                {loading || userLoading ? (
                                    <Icon className="align-middle fa-spin">
                                        spinner
                                    </Icon>
                                ) : null}
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="d-none d-sm-none d-md-none d-lg-flex col-lg-6 login-bg col-no-padding" />
            </div>
        </div>
    );
};

const mapStateToProps = ({ user: { authed } }) => ({
    authed,
});

const mapDispatchToProps = {
    initializeUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

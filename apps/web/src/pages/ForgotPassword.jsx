import React, { useState } from "react";
import InputText from "../components/inputs/InputText";
import { Alert, Button } from "react-bootstrap";
import Icon from "../components/elements/Icon";
import { BASE_URL, POST } from "../config/URLs";
import { useForm } from "react-hook-form";
import useApiCall from "../hooks/useApiCall";
import { Link } from "react-router-dom";
import qs from "query-string";

export default ({ location: { search: params = "" } }) => {
    const [{ loading = false }, forgotPassword] = useApiCall({
        baseURL: BASE_URL,
        url: "/password/email/",
        method: POST,
    });
    const { email = "" } = qs.parse(params);
    const { register, handleSubmit, errors, setValue } = useForm();
    const [changeSuccess, setChangeSuccess] = useState(false);
    const [passwordChangeError, setPasswordChangeError] = useState(null);

    const handleForgotPassword = async (params) => {
        try {
            setPasswordChangeError(null);
            setChangeSuccess(false);
            await forgotPassword({ params });
            setChangeSuccess(true);
            setValue("email", "");
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
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-6 col-no-padding">
                    <div className="container-login">
                        <div className="text-center text-lg-left">
                            <Link to="/">
                                <img alt="Logo" src="/images/logo.png" />
                            </Link>
                        </div>

                        <h1 className="sign-in-title">Forgot Password</h1>

                        <form onSubmit={handleSubmit(handleForgotPassword)}>
                            <InputText
                                label="Email Address"
                                name="email"
                                placeholder="Enter your email address"
                                errors={errors}
                                style={{ height: "56px" }}
                                defaultValue={email}
                                ref={register({
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message:
                                            "Please enter a valid email address",
                                    },
                                })}
                            />
                            <div className="d-flex mt-3">
                                Nevermind
                                <Link
                                    to="/"
                                    className="text-muted pl-1"
                                    tabIndex="-1"
                                >
                                    Sign in
                                </Link>
                            </div>
                            {changeSuccess && (
                                <Alert className="mt-3" variant="success">
                                    <Icon icon="email" />
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
                                className="btn-sign-in"
                                disabled={loading}
                            >
                                Send Reset Password Email
                                {loading ? (
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

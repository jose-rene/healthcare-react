import qs from "query-string";
import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Alert } from "react-bootstrap";
import * as Yup from "yup";

import { useUser } from "Context/UserContext";

import { Button } from "components";
import Form from "components/elements/Form";
import FapIcon from "components/elements/FapIcon";
import PasswordForm from "components/user/PasswordForm";
import PasswordRequirements from "components/user/PasswordRequirements";

import useApiCall from "hooks/useApiCall";

import { BASE_URL, POST, PUT } from "config/URLs";

const SetForgotPassword = ({ location: { search: params = "" } }) => {
    const [passwordChangeError, setPasswordChangeError] = useState(null);
    const { isAuthed } = useUser();
    const authed = isAuthed();
    const history = useHistory();
    const {
        email,
        token,
        redirect = "/?action=password-updated",
    } = qs.parse(params);
    const [goodPassword, setGoodPassword] = useState(false);
    const [passwordChecking, setPasswordChecking] = useState(false);
    const [defaultData] = useState({
        password: "",
        password_confirmation: "",
    });

    const password = useRef({});

    const [{ loading = false }, forgotPassword] = useApiCall({
        baseURL: BASE_URL,
        url: "password/reset/",
        method: POST,
    });

    const [{ authedLoading = false }, authedForgotPassword] = useApiCall({
        url: "user/password",
        method: PUT,
    });

    const [validation] = useState({
        password: {
            yupSchema: Yup.string()
                .required("Password is required")
                .min(8, "Password must be at least 8 characters")
                .max(64, "Password must be less than 65 characters"),
        },
        password_confirmation: {
            yupSchema: Yup.string().test(
                "password_confirmation",
                "The passwords do not match",
                function (value) {
                    return value === password.current;
                }
            ),
        },
    });

    const handleUpdatePassword = async (formParams) => {
        const params = { ...formParams, email, token };
        setPasswordChangeError("");

        try {
            if (authed) {
                await authedForgotPassword({ params });
            } else {
                await forgotPassword({ params });
            }

            history.push({
                pathname: redirect,
            });
        } catch (e) {
            const {
                response: { status },
            } = e;
            switch (status) {
                case 422:
                    return setPasswordChangeError(
                        <span>
                            Invalid token please redo the{" "}
                            <Link to="/password/reset" className="text-muted">
                                password reset.
                            </Link>
                        </span>
                    );

                default:
            }
        }
    };

    return (
        <div className="container">
            <h1 className="sign-in-title word-break">
                Password & Security {email}
            </h1>

            <Form
                defaultData={defaultData}
                validation={validation}
                onSubmit={handleUpdatePassword}
            >
                <div className="row">
                    <PasswordForm
                        passwordChecking={passwordChecking}
                        password={password}
                    />

                    <div className="col-md-6 ps-5">
                        <PasswordRequirements
                            secondaryValid={setGoodPassword}
                            secondaryChecking={setPasswordChecking}
                            secondaryRules
                            token={token}
                            email={email}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        {passwordChangeError && (
                            <Alert className="mt-3" variant="warning">
                                <span className="pe-1">Error:</span>{" "}
                                {passwordChangeError}
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={
                                authedLoading ||
                                loading ||
                                passwordChecking ||
                                !goodPassword
                            }
                        >
                            Reset Password
                            {authedLoading ||
                                loading ||
                                (passwordChecking && (
                                    <FapIcon
                                        icon="spinner"
                                        className="align-middle fa-spin ml-3"
                                    />
                                ))}
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default SetForgotPassword;

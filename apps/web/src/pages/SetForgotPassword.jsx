import React, {useRef, useState} from "react";
import InputText from "../components/inputs/InputText";
import {Alert, Button} from "react-bootstrap";
import Icon from "../components/elements/Icon";
import {BASE_URL, POST} from "../config/URLs";
import {useForm} from "react-hook-form";
import useApiCall from "../hooks/useApiCall";
import qs from 'query-string';
import {Link, useHistory} from "react-router-dom";

export default ({location: {search: params = ''}}) => {
    const [passwordChangeError, setPasswordChangeError] = useState(null);
    const history = useHistory();
    const {email, token} = qs.parse(params);
    const [{loading = false}, forgotPassword] = useApiCall({baseURL: BASE_URL, url: 'password/reset/', method: POST});
    const {register, handleSubmit, errors, watch} = useForm();
    const password = useRef({});
    password.current = watch("password", "");

    const handleUpdatePassword = async (formParams) => {
        const params = {...formParams, email, token};
        setPasswordChangeError('');

        try {
            await forgotPassword({params})

            history.push({
                pathname: '/',
                search: '?action=password-updated',
            });
        } catch (e) {
            const {response: {status}} = e;
            switch (status) {
                case 422:
                    return setPasswordChangeError(
                        <span>
                            Invalid token please redo the <Link to="/password/reset" className="text-muted">password reset.</Link>
                        </span>
                    );
            }
        }
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-6 col-no-padding">
                    <div className="container-login">
                        <div className="text-center text-lg-left">
                            <Link to="/">
                                <img alt="Logo" src="/images/logo.png"/>
                            </Link>
                        </div>

                        <h1 className="sign-in-title">Set Your New Password for {email}</h1>

                        <form onSubmit={handleSubmit(handleUpdatePassword)}>

                            <InputText
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="Enter your new password"
                                errors={errors}
                                style={{height: "56px"}}
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
                            <InputText
                                label="Password Confirmation"
                                name="password_confirmation"
                                type="password"
                                placeholder="Enter your new password again"
                                errors={errors}
                                style={{height: "56px"}}
                                ref={register({
                                    validate: value =>
                                        value === password.current || "The passwords do not match"
                                })}
                            />
                            {passwordChangeError && (
                                <Alert className="mt-3" variant="warning">
                                    <span className="pr-1">Error:</span>{' '}{passwordChangeError}
                                </Alert>
                            )}
                            <Button
                                type="submit"
                                variant="primary"
                                title="Sign in"
                                className="btn-sign-in"
                                disabled={loading}
                            >
                                Reset Password
                                {loading ? (
                                    <Icon className="align-middle fa-spin">
                                        spinner
                                    </Icon>
                                ) : null}
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="d-none d-sm-none d-md-none d-lg-flex col-lg-6 login-bg col-no-padding"/>
            </div>
        </div>
    );
};

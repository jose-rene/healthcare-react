import qs from 'query-string';
import React, { useRef, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import Icon from '../components/elements/Icon';
import Button from '../components/inputs/Button';
import InputText from '../components/inputs/InputText';
import PasswordRequirements from '../components/user/PasswordRequirements';
import { BASE_URL, POST } from '../config/URLs';
import useApiCall from '../hooks/useApiCall';

export default ({ location: { search: params = '' } }) => {
    const [passwordChangeError, setPasswordChangeError] = useState(null);
    const history = useHistory();
    const { email, token } = qs.parse(params);
    const { register, handleSubmit, errors, watch, getValues } = useForm();
    const [goodPassword, setGoodPassword] = useState(false);
    const [passwordChecking, setPasswordChecking] = useState(false);

    const password = useRef({});
    password.current = watch('password', '');
    const password_confirmation = useRef({});
    password_confirmation.current = watch('password_confirmation', '');

    const [{ loading = false }, forgotPassword] = useApiCall({
        baseURL: BASE_URL,
        url: 'password/reset/',
        method: POST,
    });

    const handleUpdatePassword = async (formParams) => {
        const params = { ...formParams, email, token };
        setPasswordChangeError('');

        try {
            await forgotPassword({ params });

            history.push({
                pathname: '/',
                search: '?action=password-updated',
            });
        } catch (e) {
            const { response: { status } } = e;
            switch (status) {
                case 422:
                    return setPasswordChangeError(
                        <span>
                            Invalid token please redo the <Link to="/password/reset" className="text-muted">password reset.</Link>
                        </span>,
                    );
            }
        }
    };

    return (
        <div className="container">

            <h1 className="sign-in-title word-break">Password & Security {email}</h1>

            <form onSubmit={handleSubmit(handleUpdatePassword)}>

                <div className="row">
                    <div className="col-md-6">
                        <InputText
                            disabled={passwordChecking}
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Enter your new password"
                            errors={errors}
                            style={{ height: '56px' }}
                            ref={register({
                                required: 'Password is required',
                                minLength: {
                                    value: 8,
                                    message:
                                        'Password must be at least 8 characters',
                                },
                                maxLength: {
                                    value: 64,
                                    message:
                                        'Password must be less than 65 characters',
                                },
                            })}
                        />
                        <InputText
                            disabled={passwordChecking}
                            label="Password Confirmation"
                            name="password_confirmation"
                            type="password"
                            placeholder="Enter your new password again"
                            errors={errors}
                            style={{ height: '56px' }}
                            ref={register({
                                validate: value =>
                                    value === password.current || 'The passwords do not match',
                            })}
                        />
                    </div>
                    <div className="col-md-6 pl-5">

                        <PasswordRequirements
                            secondaryValid={setGoodPassword}
                            secondaryChecking={setPasswordChecking}
                            secondaryRules
                            token={token}
                            email={email}
                            {...getValues(['password', 'password_confirmation'])}
                        />

                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        {passwordChangeError && (
                            <Alert className="mt-3" variant="warning">
                                <span className="pr-1">Error:</span>{' '}{passwordChangeError}
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading || passwordChecking || !goodPassword}
                        >
                            Reset Password
                            {loading || passwordChecking ? (
                                <Icon className="align-middle fa-spin ml-3">
                                    spinner
                                </Icon>
                            ) : null}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

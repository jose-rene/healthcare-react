import qs from "query-string";
import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import * as Yup from "yup";
import Form from "components/elements/Form";
import useAuth, { AuthError } from "../../hooks/useAuth";
import { initializeUser } from "../../actions/userAction";
import LoginForm from "./LoginForm";

// this rule wants both the htmlFor and label nested, should be either not both
/* eslint-disable jsx-a11y/label-has-associated-control */

const Login = ({
    authed,
    initializeUser,
    location: { search: params = "" } = {},
}) => {
    const [{ loading, userLoading, error }, { authUser }] = useAuth();
    const { action = false, redirect = "/dashboard" } = qs.parse(params);
    const email = useRef();
    const [loginValues, setLoginValues] = useState({});
    const [tickClearValidation, setTickClearValidation] = useState(0);

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
        try {
            const { profile } = await authUser(data, { loadProfile: true });
            await initializeUser(profile);
        } catch (e) {
            if (e instanceof AuthError) {
                setTickClearValidation(tickClearValidation + 1);
                setLoginValues({ ...data, password: "" });
            } else {
                console.log("Profile loading error:", e, typeof e);
            }
        }
    };

    if (authed) {
        return <Redirect to={redirect} />;
    }

    return (
        <Form
            onSubmit={onSubmit}
            validation={validation}
            autocomplete={false}
            defaultData={loginValues}
        >
            <LoginForm
                error={error}
                action={action}
                tickClearValidation={tickClearValidation}
                loading={loading}
                userLoading={userLoading}
                email={email}
            />
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

import qs from "query-string";
import React, { useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import * as Yup from "yup";

import { useUser } from "Context/UserContext";

import Form from "components/elements/Form";

import LoginForm from "./LoginForm";

import useAuth, { AuthError } from "hooks/useAuth";

// this rule wants both the htmlFor and label nested, should be either not both
/* eslint-disable jsx-a11y/label-has-associated-control */

const Login = ({ location: { search: params = "" } = {} }) => {
    const [{ loading, userLoading, error }, { authUser }] = useAuth();
    const { action = false, redirect = "/dashboard" } = qs.parse(params);
    const email = useRef();
    const [loginValues, setLoginValues] = useState({});
    const [tickClearValidation, setTickClearValidation] = useState(0);

    const { initUser, isAuthed } = useUser();

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
            // await initializeUser(profile);
            initUser(profile);
        } catch (e) {
            if (e instanceof AuthError) {
                setTickClearValidation(tickClearValidation + 1);
                setLoginValues({ ...data, password: "" });
            } else {
                console.log("Profile loading error:", e, typeof e);
            }
        }
    };

    if (isAuthed()) {
        // return <div>Authed!!!</div>;
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

export default Login;

import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import checkMiddleware from "../helpers/user";

const PrivateRoute = ({
    page: component = false,
    children,
    authed,
    middleware = false,
    roles,
    abilities,
    location,
    reset_password,
    primaryRole,
    ...rest
}) => {
    useEffect(() => {
        if (reset_password) {
            const path = encodeURIComponent(
                `${location.pathname}${location.search}`
            );
            window.location.assign(`/password/change?redirect=${path}`);
        }
    }, [reset_password]);

    if (
        authed &&
        middleware &&
        (!roles.length || !checkMiddleware(middleware, primaryRole, abilities))
    ) {
        window.location.assign("/access-denied");
        return false;
    }

    const renderComponent = () => {
        if (component) {
            return component;
        }

        return children;
    };

    // authed is passed down from parent component, from redux state auth userToken
    return !authed ? (
        <Redirect to={{ pathname: "/", state: { from: location } }} />
    ) : (
        <Route {...rest} render={renderComponent} />
    );
};

const mapStateToProps = ({
    user: { roles, authed, abilities, reset_password, primaryRole },
}) => ({
    abilities,
    roles,
    authed,
    reset_password,
    primaryRole,
});

export default connect(mapStateToProps)(PrivateRoute);

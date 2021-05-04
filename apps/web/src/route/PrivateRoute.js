import React, { useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import checkMiddleware from "../helpers/user";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({
    page: component = false,
    children,
    authed,
    middleware = false,
    roles,
    abilities,
    requiredAbility = false,
    location,
    reset_password,
    primaryRole,
    ...rest
}) => {
    const [{}, { permissionCheck }] = useAuth();

    const path = useMemo(() => {
        return encodeURIComponent(
            `${location.pathname}${location.search}`,
        );
    }, [location]);

    // If the user needs to reset their password then push the user to the
    // reset password screen and when they are done bring them back
    useEffect(() => {
        if (reset_password) {
            window.location.assign(`/password/change?redirect=${path}`);
        }
    }, [reset_password]);

    useEffect(() => {
        if (requiredAbility) {
            (async () => {
                const passed = await permissionCheck({ requiredAbility });

                if (!passed) {
                    window.location.assign(`/access-denied?redirect=${path}`);
                }
            })();
        }
    }, [requiredAbility]);

    if (
        authed &&
        middleware &&
        (!roles.length || !checkMiddleware(middleware, primaryRole, abilities))
    ) {
        window.location.assign(`/access-denied?redirect=${path}`);
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

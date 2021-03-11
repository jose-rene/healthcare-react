import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { checkMiddleware } from "../helpers/user";

const PrivateRoute = ({
    page: component = false,
    children,
    authed,
    middleware = false,
    roles,
    abilities,
    location,
    ...rest
}) => {
    console.log(abilities);
    if (authed && middleware && !checkMiddleware(middleware, roles)) {
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

const mapStateToProps = ({ user: { roles, authed, abilities } }) => ({
    abilities,
    roles,
    authed,
});

export default connect(mapStateToProps)(PrivateRoute);

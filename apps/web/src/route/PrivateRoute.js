import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { checkMiddleware } from "../helpers/user";

const PrivateRoute = ({
    children,
    authed,
    middleware = false,
    roles,
    location,
    ...rest
}) => {
    if (authed && middleware && !checkMiddleware(middleware, roles)) {
        window.location.assign("/access-denied");
        return false;
    }

    // authed is passed down from parent component, from redux state auth userToken
    return !authed ? (
        <Redirect to={{ pathname: "/", state: { from: location } }} />
    ) : (
        <Route {...rest} render={({}) => children} />
    );
};

const mapStateToProps = ({ user: { roles, authed } }) => ({
    roles,
    authed,
});

export default connect(mapStateToProps)(PrivateRoute);

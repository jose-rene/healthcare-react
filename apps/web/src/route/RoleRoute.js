import React from "react";
import { connect } from "react-redux";
import PrivateRoute from "./PrivateRoute";

export const RoleRouteRouter = ({
    component: _component = "",
    children,
    authed,
    primaryRole,
    ...rest
}) => {
    let component = null;
    try {
        component = primaryRole ? require(
            `../pages/${_component}/${primaryRole}`).default : undefined;
    } catch (err) {
        component = require("../pages/NotFound").default;
    }

    return (
        <PrivateRoute
            authed={authed}
            middleware={[primaryRole]}
            component={component}
            {...rest}
        >
            {children}
        </PrivateRoute>
    );
};

const mapStateToProps = ({ user: { primaryRole } }) => ({
    primaryRole,
});

export default connect(mapStateToProps)(RoleRouteRouter);

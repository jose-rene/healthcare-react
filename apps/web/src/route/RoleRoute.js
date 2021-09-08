import { useUser } from "Context/UserContext";
import React from "react";
import PrivateRoute from "./PrivateRoute";

const RoleRouteRouter = ({ component: _component = "", children, ...rest }) => {
    let component = null;

    const { getUser } = useUser();
    const { primaryRole, authed } = getUser();

    try {
        component = primaryRole
            ? require(`../pages/${_component}/${primaryRole}`).default
            : undefined;
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

export default RoleRouteRouter;

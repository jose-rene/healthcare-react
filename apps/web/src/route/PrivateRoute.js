import React, { useEffect, useMemo } from "react";
import { Redirect, Route } from "react-router-dom";
import { useUser } from "Context/UserContext";
import checkMiddleware from "../helpers/user";
import useAuth from "../hooks/useAuth";
import PageLayout from "../layouts/PageLayout";

const PrivateRoute = ({
    page: component = false,
    children,
    middleware = [],
    requiredAbility = false,
    location,
    addLayout = false,
    ...rest
}) => {
    const [{ permissionCheck }] = useAuth();

    const path = useMemo(() => {
        return encodeURIComponent(`${location.pathname}${location.search}`);
    }, [location]);

    const { getUser } = useUser();
    const { authed, abilities, primaryRole, reset_password, roles } = getUser();

    // If the user needs to reset their password then push the user to the
    // reset password screen and when they are done bring them back
    useEffect(() => {
        if (reset_password) {
            window.location.assign(`/password/change?redirect=${path}`);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requiredAbility]);

    const Page = useMemo(() => {
        if (addLayout) {
            return (
                <PageLayout>
                    <Route {...rest} render={component ? null : children} />
                </PageLayout>
            );
        }

        return (
            <Route {...rest} render={component ? null : children} />
        );
    }, [addLayout]);

    // console.log(middleware.length, component);
    if (
        authed &&
        middleware?.length &&
        (!roles.length || !checkMiddleware(middleware, primaryRole, abilities))
    ) {
        window.location.assign(`/access-denied?redirect=${path}`);
        // return <div>Access Denied</div>;
        return false;
    }

    return !authed ? (
        <Redirect to={{ pathname: "/", state: { from: location } }} />
    ) : Page;
};

export default PrivateRoute;

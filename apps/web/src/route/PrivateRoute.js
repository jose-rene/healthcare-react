import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { checkMiddleware } from '../helpers/user';

const PrivateRoute = ({ children, authed, middleware, roles, ...rest }, context) => {
    if (middleware && !checkMiddleware(middleware, roles)) {
        window.location.href = '/dashboard?access_denied';
        return false;
    }
    // authed is passed down from parent component, from redux state auth userToken
    return (
        <Route
            {...rest}
            render={({ location }) =>
                authed ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: '/',
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    );
};

const mapStateToProps = ({ user: { roles } }) => ({
    roles,
});

export default connect(mapStateToProps)(PrivateRoute);

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { signOut } from '../actions/authAction';
import { DOCTOR, initializeUser, setUser } from '../actions/userAction';
import useApiCall from '../hooks/useApiCall';
import Account from '../pages/Account';
import Assessment from '../pages/Assessment';
import Federated from '../pages/Federated';
import ForgotPassword from '../pages/ForgotPassword';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Error from '../pages/NotFound';
import Questionnaire from '../pages/Questionnaire';
import SetForgotPassword from '../pages/SetForgotPassword';
import PrivateRoute from '../route/PrivateRoute';

const AppNavigation = ({ user: { authed, initializing }, setUser, localAuth, initializeUser }) => {
    const [{ loading, data: user = {} }, fireInitializeUser] = useApiCall({
        url: 'user/profile',
    });

    useEffect(() => {
        /**
         * on page load call the api to refresh the redux storage
         */
        (async () => {
            try {
                const response = await fireInitializeUser();
                initializeUser(response);
            } catch (e) {
                initializeUser();
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const response = await fireInitializeUser();
            initializeUser(response);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localAuth]);

    if (loading || initializing) {
        return null;
    }

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={Login} exact/>
                <Route path="/sso" component={Federated}/>
                <Route path="/password/reset" component={ForgotPassword}/>
                <Route path="/password/change" component={SetForgotPassword}/>
                <PrivateRoute path="/dashboard" authed={authed}>
                    <Home/>
                </PrivateRoute>
                <PrivateRoute path="/account" authed={authed}>
                    <Account/>
                </PrivateRoute>
                <PrivateRoute path="/some/random/doc/route" authed={authed} middleware={[DOCTOR]}>
                    <Account/>
                </PrivateRoute>
                <PrivateRoute path="/questionnaire/:id" authed={authed}>
                    <Questionnaire/>
                </PrivateRoute>
                <PrivateRoute path="/assessment/:id" authed={authed}>
                    <Assessment/>
                </PrivateRoute>
                <Route component={Error}/>
            </Switch>
        </BrowserRouter>
    );
};

const mapStateToProps = (state) => {
    return {
        localAuth: state.auth,
        user: state.user,
    };
};

const mapDispatchToProps = { setUser, signOut, initializeUser };

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigation);

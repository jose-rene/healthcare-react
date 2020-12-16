import React, {useEffect} from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import PrivateRoute from "../route/PrivateRoute";
import Login from "../pages/Login";
import Error from "../pages/NotFound";
import Dash from "../pages/Dash";
import Account from "../pages/Account";
import Federated from "../pages/Federated";
import Questionnaire from "../pages/Questionnaire";
import apiService from "../services/apiService";
import {setUser} from "../actions/userAction";
import {signOut} from "../actions/authAction";
import ForgotPassword from "../pages/ForgotPassword";
import SetForgotPassword from "../pages/SetForgotPassword";

const AppNavigation = ({setUser, signOut, localAuth, user}) => {
    // if the server returns unauthorized, @todo handle logic for this in apiService hook so it doesn't effect login
    /* axios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (
                !error.response ||
                (error?.response && error.response.status === 401)
            ) {
                // console.log("signout");
                signOut();
            }
            return Promise.reject(error);
        }
    ); */

    useEffect(() => {
        let isMounted = true;
        if (!user.email && localAuth.userToken) {
            apiService("/user")
                .then(({ email, full_name, roles = [] }) => {
                    if (isMounted) {
                        setUser(email, full_name, roles);
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        }
        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localAuth]);

    const authed = localAuth.userToken ? 1 : 0;

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={Login} exact/>
                <Route path="/sso" component={Federated}/>
                <Route path="/password/reset" component={ForgotPassword}/>
                <Route path="/password/change" component={SetForgotPassword}/>
                <PrivateRoute path="/dashboard" authed={authed}>
                    <Dash/>
                </PrivateRoute>
                <PrivateRoute path="/account" authed={authed}>
                    <Account/>
                </PrivateRoute>
                <PrivateRoute path="/questionnaire/:id" authed={authed}>
                    <Questionnaire/>
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

const mapDispatchToProps = { setUser, signOut };

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigation);

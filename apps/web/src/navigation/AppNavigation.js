import React, { useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import PrivateRoute from "../route/PrivateRoute";
import Login from "../pages/Login";
import Error from "../pages/NotFound";
import Dash from "../pages/Dash";
import Account from "../pages/Account";
import Questionnaire from "../pages/Questionnaire";
import apiService from "../services/apiService";
import { setUser } from "../actions/userAction";
import { signOut } from "../actions/authAction";

const AppNavigation = ({ setUser, signOut, localAuth, user }) => {
    // if the server returns unauthorized
    axios.interceptors.response.use(
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
    );

    useEffect(() => {
        let isMounted = true;
        if (!user.email && localAuth.userToken) {
            apiService("/user")
                .then(({ email, full_name }) => {
                    if (isMounted) {
                        setUser(email, full_name);
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
                <Route path="/" component={Login} exact />
                <PrivateRoute path="/dashboard" authed={authed}>
                    <Dash />
                </PrivateRoute>
                <PrivateRoute path="/account" authed={authed}>
                    <Account />
                </PrivateRoute>
                <PrivateRoute path="/questionnaire/:id" authed={authed}>
                    <Questionnaire />
                </PrivateRoute>
                <Route component={Error} />
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

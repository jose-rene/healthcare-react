import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import PrivateRoute from "../route/PrivateRoute";
import Login from "../pages/Login";
import Error from "../pages/NotFound";
import Dash from "../pages/Dash";
import apiService from "../services/apiService";
import { restoreToken } from "../actions/restoreAction";
import { setUser } from "../actions/userAction";

const AppNavigation = ({ setUser, localAuth, user }) => {
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
          // console.log(e);
        });
    }
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localAuth]);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Login} exact />
        <PrivateRoute path="/dashboard" authed={localAuth.userToken ? 1 : 0}>
          <Dash />
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

const mapDispatchToProps = {
  restoreToken,
  setUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigation);

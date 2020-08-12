import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import PrivateRoute from "../route/PrivateRoute";
import Login from "../pages/Login";
import Error from "../pages/NotFound";
import Dash from "../pages/Dash";
import { restoreToken } from "../actions/restoreAction";

const AppNavigation = ({ localAuth }) => {
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
  };
};

const mapDispatchToProps = {
  restoreToken,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigation);

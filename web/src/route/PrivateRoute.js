import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ children, authed, ...rest }) => {
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
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;

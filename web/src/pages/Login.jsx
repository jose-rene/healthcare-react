import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Alert, Button, Form } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import { restoreToken } from "../actions/restoreAction";
import "../App.css";
import logo from "../assets/images/splash.png";

const Login = ({ localAuth, restoreToken }) => {
  // tokenLoading is async storage, loading is http
  const [
    { tokenLoading, authToken, loading, error },
    { loadAuth, authUser },
  ] = useAuth();

  const [state, setState] = useState({
    email: "",
    password: "",
    // hidePassword: true,
  });

  useEffect(() => {
    let isMounted = true;
    if (tokenLoading) {
      // load local storage token
      loadAuth();
    } else if (authToken) {
      // action to update redux store auth
      if (isMounted) {
        restoreToken(authToken);
      }
    }
    // cleanup
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  if (localAuth.userToken) {
    // @todo, use history to redirect to previous path before login
    return <Redirect to="/dashboard" />;
  }

  const onChange = (name, value) => {
    setState({ ...state, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    authUser({ ...state });
  };

  return (
    <div className="App">
      <Alert key="0" variant="success" style={{ marginBottom: 0 }}>
        Web App Login
      </Alert>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Form className="mt-3" onSubmit={onSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              autoComplete="username"
              onChange={(e) => onChange("email", e.target.value)}
              value={state.email}
            />
            <Form.Text className="text-muted">
              Your registered email address.
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              onChange={(e) => onChange("password", e.target.value)}
              value={state.password}
            />
          </Form.Group>
          {error ? <Alert variant="warning">Error: {error}</Alert> : null}
          <Button
            type="submit"
            variant="primary"
            title="Login"
            loading={loading.toString()}
          >
            Log In
          </Button>
        </Form>
      </header>
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  localAuth: auth,
});

const mapDispatchToProps = {
  restoreToken,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

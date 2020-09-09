import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Alert, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
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

  const { register, handleSubmit, errors } = useForm();

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

  const onSubmit = (data) => {
    authUser(data);
  };

  return (
    <div className="App">
      <Alert key="0" variant="success" style={{ marginBottom: 0 }}>
        Web App Login
      </Alert>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Form className="mt-3" onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              autoComplete="username"
              name="email"
              ref={register({
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <Form.Text className="text-muted">
                {errors.email.message}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              name="password"
              ref={register({
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                maxLength: {
                  value: 64,
                  message: "Password must be less than 65 characters",
                },
              })}
            />
            {errors.password && (
              <Form.Text className="text-muted">
                {errors.password.message}
              </Form.Text>
            )}
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

import React, {useEffect, useState} from "react";
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";
import {Alert, Button, Form} from "react-bootstrap";
import useApiCall from "../hooks/useApiCall";
import {POST} from "../config/URLs";
import useAuth from "../hooks/useAuth";
import {restoreToken} from "../actions/restoreAction";
import "../App.css";
import logo from "../assets/images/splash.png";

const Login = ({localAuth, restoreToken}) => {
  const [{data, loading, error}, callApi] = useApiCall();
  const [{authed, isLoading, token}, {setAuth, loadAuth}] = useAuth();

  const [state, setState] = useState({
    email: "",
    password: "",
    hidePassword: true,
  });

  useEffect(() => {
    let isMounted = true;
    if (isLoading) {
      // load local storage token
      loadAuth();
    } else if (data.access_token) {
      // sets the token received from api in local storage
      setAuth(data.access_token, data.token_type, data.expires_at).then(() => {
        // // action to update redux store auth
        if (isMounted) restoreToken(data.access_token);
      });
    } else if (authed) {
      // action to update redux store auth
      if (isMounted) {
        restoreToken(token);
      }
    }
    // cleanup
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, data, authed]);

  if (localAuth.userToken) {
    // @todo, use history to redirect to previous path before login
    return <Redirect to="/dashboard"/>;
  }

  const onChange = (name, value) => {
    setState({...state, [name]: value});
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    callApi("login", {params: {...state}, method: POST});
  };

  return (
      <div className="App">
        <Alert key="0" variant="success" style={{marginBottom: 0}}>
          Web App Login
        </Alert>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
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
          {error ? <Alert variant="warning">{error}</Alert> : null}
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

import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Alert, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import { restoreToken } from "../actions/restoreAction";
import InputText from "../components/inputs/InputText";

// this rule wants both the htmlFor and label nested, should be either not both
/* eslint-disable jsx-a11y/label-has-associated-control */

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
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-6 col-no-padding">
          <div className="container-login">
            <div className="text-center text-lg-left">
              <img alt="Logo" src="/images/logo.png" />
            </div>

            <h1 className="sign-in-title">Sign In</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
              <InputText
                label="Account"
                name="email"
                placeholder="Enter your email address"
                errors={errors}
                style={{ height: "56px" }}
                ref={register({
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                })}
              />
              <InputText
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                errors={errors}
                style={{ height: "56px" }}
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
              <div className="d-flex justify-content-between flex-wrap mt-3">
                <a href="#" className="btn-forgot-password">
                  Forgot my password
                </a>
              </div>
              {error ? (
                <Alert className="mt-3" variant="warning">
                  Error: {error}
                </Alert>
              ) : null}
              <Button
                type="submit"
                variant="primary"
                title="Sign in"
                className="btn-sign-in"
                loading={loading.toString()}
              >
                Sign In
              </Button>
            </form>
          </div>
        </div>

        <div className="d-none d-sm-none d-md-none d-lg-flex col-lg-6 login-bg col-no-padding" />
      </div>
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

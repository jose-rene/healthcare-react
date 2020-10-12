import React from "react";
import { connect } from "react-redux";
import { Alert } from "react-bootstrap";
import { signOut } from "../actions/authAction";

const DashLayout = ({ full_name, email, localAuth, signOut, children }) => {
  const logOut = (e) => {
    e.preventDefault();
    signOut();
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <Alert
            key="0"
            variant="info"
            className="text-center"
            style={{ marginBottom: 0 }}
          >
            Welcome to the Gryphon Dashboard
            {email ? (
              <span data-testid="userinfo">
                {email} {full_name}
              </span>
            ) : null}
            <span className="ml-2">
              <a className="text-danger" href="/" onClick={logOut}>
                Logout
              </a>
            </span>
          </Alert>
        </div>
      </div>
      {children}
    </div>
  );
};

const mapStateToProps = ({ auth, user: { email, full_name } }) => ({
  localAuth: auth,
  email,
  full_name,
});

const mapDispatchToProps = {
  signOut,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashLayout);
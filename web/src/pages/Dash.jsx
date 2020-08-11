import React from "react";
import { connect } from "react-redux";
import { Alert } from "react-bootstrap";
import { signOut } from "../actions/restoreAction";
import useAuth from "../hooks/useAuth";
import logo from "../assets/images/splash.png";

const Dash = ({ signOut }) => {
  // eslint-disable-next-line no-unused-vars
  const [authState, { doLogout }] = useAuth();
  const logOut = (e) => {
    e.preventDefault();
    doLogout();
    signOut();
  };
  return (
    <div className="App">
      <Alert key="0" variant="info" style={{ marginBottom: 0 }}>
        Welcome to the Gryphon Dashboard
      </Alert>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello World!</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          onClick={logOut}
        >
          Log out
        </a>
      </header>
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  localAuth: auth,
});

const mapDispatchToProps = {
  signOut,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dash);

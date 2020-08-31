import React from "react";
import { connect } from "react-redux";
import DashLayout from "../layouts/dashLayout";
import { signOut } from "../actions/restoreAction";
import useAuth from "../hooks/useAuth";
import logo from "../assets/images/splash.png";

const Dash = ({ email, full_name, signOut }) => {
  // eslint-disable-next-line no-unused-vars
  const [authState, { doLogout }] = useAuth();
  const logOut = (e) => {
    e.preventDefault();
    doLogout()
      .then(() => {
        signOut();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <DashLayout>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello World! {email} {full_name}
        </p>
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
    </DashLayout>
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

export default connect(mapStateToProps, mapDispatchToProps)(Dash);

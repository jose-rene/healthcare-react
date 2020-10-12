import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import DashLayout from "../layouts/dashLayout";
import logo from "../assets/images/splash.png";

const Account = ({ email, full_name }) => {
  return (
    <DashLayout>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          My Account! {email} {full_name}
        </p>
        <Link to="/dashboard">Dashboard</Link>
      </header>
    </DashLayout>
  );
};

const mapStateToProps = ({ auth, user: { email, full_name } }) => ({
  localAuth: auth,
  email,
  full_name,
});

export default connect(mapStateToProps)(Account);
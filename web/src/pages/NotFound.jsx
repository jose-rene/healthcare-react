import React from "react";
import "../App.css";
import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/images/splash.png";

const NotFound = () => {
  return (
    <div className="App">
      <Alert key="0" variant="warning">
        Error Page Not Found
      </Alert>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Link to="/">Login</Link>
      </header>
    </div>
  );
};

export default NotFound;

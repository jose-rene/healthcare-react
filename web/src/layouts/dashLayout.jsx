import React from "react";
import { connect } from "react-redux";
import { Alert } from "react-bootstrap";
import { signOut } from "../actions/restoreAction";

const dashLayout = ({ full_name, email, children }) => {
  return (
    <div className="App">
      <Alert
        key="0"
        variant="info"
        className="text-center"
        style={{ marginBottom: 0 }}
      >
        Welcome to the Gryphon Dashboard {email} {full_name}
      </Alert>
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

export default connect(mapStateToProps, mapDispatchToProps)(dashLayout);

import React, { useEffect } from "react";
import { Redirect, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { Alert, Spinner } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import { restoreToken } from "../actions/authAction";

const Federated = ({ localAuth, restoreToken }) => {
    // for the authorization request
    const [{ authToken, loading, error }, { authSsoUser }] = useAuth();
    const location = useLocation();
    // console.log(location, loading, error);

    // intially send sso request based on url
    useEffect(() => {
        let isMounted = true;
        // send the auth request based on the query string
        authSsoUser(location);
        // cleanup
        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // update redux store if authToken is updated from api request
    useEffect(() => {
        let isMounted = true;
        if (authToken) {
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
        return <Redirect to="/dashboard" />;
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-12 mt-5 text-center">
                    <img alt="Logo" src="/images/logo.png" />
                    <div className="mt-3" style={{ color: "#444444" }}>
                        {error ? (
                            <Alert className="mt-3" variant="warning">
                                {error}
                            </Alert>
                        ) : (
                            <div data-testid="ssoLoading">
                                <Spinner
                                    animation="border"
                                    variant="secondary"
                                />
                                <br />
                                <span
                                    className="ml-2"
                                    style={{ paddingTop: "12px" }}
                                >
                                    Authenticating
                                </span>
                            </div>
                        )}
                    </div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Federated);

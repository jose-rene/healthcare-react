import React, { useEffect } from "react";
import { Redirect, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { Alert, Spinner } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import { initializeUser } from "../actions/userAction";

const Federated = ({ authed, initializeUser }) => {
    // for the authorization request
    const [{ error }, { authSsoUser }] = useAuth();
    const location = useLocation();

    // intially send sso request based on url
    useEffect(() => {
        async function loadSsoUser() {
            try {
                const { profile } = await authSsoUser(location, {
                    loadProfile: true,
                });
                await initializeUser(profile);
            } catch (e) {
                console.log("Profile loading error:", e);
            }
        }
        let isMounted = true;
        // send the auth request based on the query string
        if (isMounted) {
            loadSsoUser();
        }
        // cleanup
        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (authed) {
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

const mapStateToProps = ({ user: { authed } }) => ({
    authed,
});

const mapDispatchToProps = {
    initializeUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Federated);

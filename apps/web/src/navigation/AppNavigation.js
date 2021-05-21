import React, { useEffect } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { signOut } from "../actions/authAction";
import { ADMIN, initializeUser } from "../actions/userAction";
import useApiCall from "../hooks/useApiCall";
import Account from "../pages/Account/Account";
import Table from "../pages/Test/Table";
import HpAddUser from "../pages/healthplan/AddUser";
import HpEditUser from "../pages/healthplan/EditUser";
import HpAddMember from "../pages/healthplan/AddMember";
import HpSearchMember from "../pages/healthplan/SearchMember";
import HpTraining from "../pages/Training/Training";
import NewRequestAdd from "../pages/newRequestAdd/NewRequestAdd";
import RequestLookup from "../pages/RequestLookup/RequestLookup";
import Assessment from "../pages/Assessment";
import Error401 from "../pages/Errors/401";
import Federated from "../pages/Federated";
import ForgotPassword from "../pages/ForgotPassword";
import Login from "../pages/Login";
import Error from "../pages/NotFound";
import Questionnaire from "../pages/Questionnaire";
import SetForgotPassword from "../pages/SetForgotPassword";
import PrivateRoute from "../route/PrivateRoute";
import RoleRouteRouter from "../route/RoleRoute";
import AdminPayer from "../pages/Test/AdminPayer";

const AppNavigation = ({ initializing, initializeUser }) => {
    const [{ loading }, fireInitializeUser] = useApiCall({
        url: "user/profile",
    });

    useEffect(() => {
        /**
         * on page load call the api to refresh the redux storage
         */
        (async () => {
            try {
                const response = await fireInitializeUser();
                initializeUser(response);
            } catch (e) {
                initializeUser();
            }
        })();
    }, []);

    if (loading || initializing) {
        return null;
    }

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={Login} exact />
                <Route path="/sso" component={Federated} />
                <Route path="/password/reset" component={ForgotPassword} />
                <Route path="/password/change" component={SetForgotPassword} />
                <RoleRouteRouter path="/dashboard" component="Home" />
                <PrivateRoute
                    path="/access-denied"
                    component={Error401}
                    exact
                />
                <PrivateRoute path="/account">
                    <Account />
                </PrivateRoute>
                <PrivateRoute
                    path="/healthplan/addmember"
                    middleware={["hp_champion", "hp_user"]}
                >
                    <HpAddMember />
                </PrivateRoute>
                <PrivateRoute
                    path="/healthplan/start-request"
                    middleware={["hp_manager", "hp_champion", "hp_user"]}
                    component={HpSearchMember}
                />
                <PrivateRoute
                    path="/healthplan/adduser"
                    middleware={["hp_champion", "create-users"]}
                >
                    <HpAddUser />
                </PrivateRoute>
                <PrivateRoute
                    path="/healthplan/user/:id"
                    middleware={["hp_champion", "create-users"]}
                >
                    <HpEditUser />
                </PrivateRoute>
                <PrivateRoute
                    path="/member/:member_id/request/add"
                    middleware={["hp_user", "hp_champion"]}
                    component={NewRequestAdd}
                />
                <PrivateRoute
                    path="/member/:member_id/request/:request_id/edit"
                    middleware={["hp_user", "hp_manager", "hp_champion"]}
                    component={NewRequestAdd}
                />
                <PrivateRoute
                    path="/healthplan/requests"
                    middleware={["hp_user", "hp_manager", "hp_champion"]}
                    component={RequestLookup}
                />
                <PrivateRoute
                    path="/healthplan/training"
                    middleware={["hp_user", "hp_champion"]}
                    component={HpTraining}
                />
                <PrivateRoute
                    exact
                    path="/admin/test/table"
                    middleware={[ADMIN]}
                    page={<Table />}
                />
                <PrivateRoute
                    exact
                    path="/admin/test/payer"
                    requiredAbility="can:edit-payer"
                    page={<AdminPayer />}
                />
                <PrivateRoute path="/questionnaire/:id">
                    <Questionnaire />
                </PrivateRoute>
                <PrivateRoute path="/assessment/:id">
                    <Assessment />
                </PrivateRoute>

                {/* ERROR PAGES */}
                <Route component={Error} />
            </Switch>
        </BrowserRouter>
    );
};

const mapStateToProps = ({ user: { authed, initializing } }) => ({
    initializing,
});

const mapDispatchToProps = { signOut, initializeUser };

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigation);

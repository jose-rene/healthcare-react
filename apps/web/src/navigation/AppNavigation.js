import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { useUser } from "Context/UserContext";

import { ADMIN } from "actions/types";

import PrivateRoute from "route/PrivateRoute";
import RoleRouteRouter from "route/RoleRoute";

import useApiCall from "hooks/useApiCall";

import RequestEdit from "pages/healthplan/RequestEdit";
import Account from "pages/Account/Account";
import Table from "pages/Test/Table";
import HpAddUser from "pages/healthplan/AddUser";
import HpEditUser from "pages/healthplan/EditUser";
import HpAddMember from "pages/healthplan/AddMember";
import HpSearchMember from "pages/healthplan/SearchMember";
import HpTraining from "pages/Training/Training";
import NewRequestAdd from "pages/newRequestAdd/NewRequestAdd";
import RequestLookup from "pages/RequestLookup/RequestLookup";
import AssessmentList from "pages/Assessment/AssessmentList";
import AssessmentAdd from "pages/Assessment/AssessmentAdd";
import Assessment from "pages/Assessment/Assessment";
import AssessmentRules from "pages/Admin/AssessmentRules/AssessmentRules";
import Error401 from "pages/Errors/401";
import Federated from "pages/Federated";
import ForgotPassword from "pages/ForgotPassword";
import Login from "pages/Login";
import Error from "pages/NotFound";
import SetForgotPassword from "pages/SetForgotPassword";
import NotificationList from "pages/NotificationList";
import AdminPayer from "pages/Test/AdminPayer";
import AdminClients from "pages/Admin/Clients/Clients";
import AdminAddClients from "pages/Admin/Clients/AddClients";
import AdminDetailClients from "pages/Admin/Clients/DetailClients";
import AdminClinicians from "pages/Admin/Clinicians/Clinicians";
import AdminAddClinicians from "pages/Admin/Clinicians/AddClinicians";
import FormView from "pages/Admin/FormBuilder/show";
import FormBuilderEdit from "pages/Admin/FormBuilder/edit";
import FormIndex from "pages/Admin/FormBuilder/Index";
import AdminUserList from "pages/Admin/UserList/UserList";
import AdminUserEdit from "pages/Admin/UserList/UserEdit";
import AdminUserAdd from "pages/Admin/UserList/UserAdd";
import FormWizard from "pages/FormWizard";
import RequestSections from "pages/RequestSections";
import RequestSectionsShowForm from "pages/RequestSections/RequestSectionsShowForm";
import NarrativeReport from "pages/Admin/NarrativeReport";
import EditNarrativeReport from "pages/Admin/NarrativeReport/Edit";
import Invoices from "pages/Invoices";
import NarrativeReportPreview from "../pages/NarrativeReport/Preview";

const AppNavigation = () => {
    const [{ loading }, fireInitializeUser] = useApiCall({
        url: "user/profile",
    });

    const { initUser, getUser, logout } = useUser();
    const { initializing } = getUser();

    useEffect(() => {
        /**
         * on page load call the api to refresh the user state
         */
        let isMounted = true;
        if (isMounted) {
            (async () => {
                try {
                    const response = await fireInitializeUser();
                    // initializeUser(response);
                    initUser(response);
                } catch (e) {
                    // console.log("fail!!!");
                    logout();
                }
            })();
        }
        // cleanup
        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <PrivateRoute path="/account" component={Account} />
                <PrivateRoute
                    path="/healthplan/addmember"
                    middleware={["hp_champion", "hp_user"]}
                    component={HpAddMember}
                />
                <PrivateRoute
                    path="/healthplan/start-request"
                    middleware={["hp_manager", "hp_champion", "hp_user"]}
                    component={HpSearchMember}
                />
                <PrivateRoute
                    path="/healthplan/adduser"
                    middleware={["hp_champion", "software_engineer"]}
                    component={HpAddUser}
                />

                <PrivateRoute
                    path="/healthplan/user/:id"
                    middleware={["hp_champion", "software_engineer"]}
                    component={HpEditUser}
                />
                <PrivateRoute
                    path="/member/:member_id/request/add"
                    middleware={["hp_user", "hp_champion"]}
                    component={NewRequestAdd}
                />
                <PrivateRoute
                    path="/member/:member_id/request/:request_id/edit"
                    middleware={[
                        "hp_user",
                        "hp_manager",
                        "hp_champion",
                        "client_services_specialist",
                    ]}
                    component={NewRequestAdd}
                />
                <PrivateRoute
                    path="/requests/:request_id/form-sections/:form_slug"
                    middleware={[
                        "field_clinician",
                        "coo",
                        "client_services_specialist",
                        "client_services_manager",
                    ]}
                    component={RequestSectionsShowForm}
                />
                <PrivateRoute
                    path="/requests/:request_id/form-sections"
                    middleware={[
                        "field_clinician",
                        "coo",
                        "client_services_specialist",
                        "client_services_manager",
                    ]}
                    component={RequestSections}
                />
                <PrivateRoute
                    path="/requests/:id"
                    middleware={[
                        "hp_user",
                        "hp_manager",
                        "hp_champion",
                        "coo",
                        "client_services_specialist",
                        "client_services_manager",
                    ]}
                    component={RequestEdit}
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
                    path="/invoices"
                    middleware={["hp_user", "hp_champion"]}
                    component={Invoices}
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

                <PrivateRoute
                    path="/admin/forms/:form_slug/edit"
                    middleware={["software_engineer"]}
                    component={FormBuilderEdit}
                />

                <PrivateRoute
                    path="/request/:request/template/:template"
                    middleware={[
                        "software_engineer",
                        "clinical_reviewer",
                        "reviewer_manager",
                    ]}
                    component={NarrativeReportPreview}
                />

                <PrivateRoute
                    path="/forms/:form_slug/show"
                    middleware={["software_engineer"]}
                    component={FormView}
                />

                <PrivateRoute
                    path="/form-wizard/:form_group_slug"
                    middleware={[]}
                    component={FormWizard}
                />

                <PrivateRoute
                    path="/admin/forms"
                    middleware={["software_engineer"]}
                    component={FormIndex}
                />

                <PrivateRoute
                    path="/admin/narrative-report/:slug/edit"
                    middleware={["software_engineer"]}
                    component={EditNarrativeReport}
                    addLayout
                />

                <PrivateRoute
                    path="/admin/narrative-report"
                    middleware={["software_engineer"]}
                    component={NarrativeReport}
                    addLayout
                />

                <PrivateRoute
                    path="/admin/clients"
                    middleware={["software_engineer"]}
                    component={AdminClients}
                />

                <PrivateRoute
                    path="/admin/add-clients"
                    middleware={["software_engineer"]}
                    component={AdminAddClients}
                />

                <PrivateRoute
                    path="/admin/client/:id"
                    middleware={["software_engineer"]}
                    component={AdminDetailClients}
                />

                <PrivateRoute
                    path="/admin/client/:id/edit"
                    middleware={["software_engineer"]}
                    component={AdminDetailClients}
                />

                <PrivateRoute
                    exact
                    path="/admin/clinicians"
                    middleware={["software_engineer"]}
                    component={AdminClinicians}
                />

                <PrivateRoute
                    path="/admin/add-clinicians"
                    middleware={["software_engineer"]}
                    component={AdminAddClinicians}
                />

                <PrivateRoute
                    path="/admin/clinicians/:id/edit"
                    middleware={["software_engineer"]}
                    component={AdminAddClinicians}
                />

                <PrivateRoute
                    exact
                    path="/admin/users"
                    middleware={["create-users"]}
                    component={AdminUserList}
                />

                <PrivateRoute
                    path="/admin/users/add"
                    middleware={["create-users"]}
                    component={AdminUserAdd}
                />

                <PrivateRoute
                    path="/admin/users/:id/edit"
                    middleware={["create-users"]}
                    component={AdminUserEdit}
                />

                <PrivateRoute
                    path="/notifications"
                    component={NotificationList}
                />

                <PrivateRoute
                    exact
                    path="/admin/assessments"
                    middleware={["software_engineer"]}
                    component={AssessmentList}
                />

                <PrivateRoute
                    path="/admin/add-assessment"
                    middleware={["software_engineer"]}
                    component={AssessmentAdd}
                />

                <PrivateRoute
                    path="/admin/assessments/:id"
                    middleware={["software_engineer"]}
                    component={AssessmentAdd}
                />

                <PrivateRoute
                    path="/admin/assessment/rules"
                    middleware={["software_engineer"]}
                    component={AssessmentRules}
                />

                <PrivateRoute path="/assessment/:id" component={Assessment} />

                {/* ERROR PAGES */}
                <Route component={Error} />
            </Switch>
        </BrowserRouter>
    );
};

export default AppNavigation;

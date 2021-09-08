import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import PageLayout from "../../layouts/PageLayout";
import TabAccount from "./Tabs/TabAccount";
import TabDocuments from "./Tabs/TabDocuments";
import TabSecurity from "./Tabs/TabSecurity";
import "../../styles/account.scss";
import BroadcastAlert from "components/elements/BroadcastAlert";
import { useUser } from "Context/UserContext";

const Account = ({ history }) => {
    const { getUser } = useUser();
    const currentUser = getUser();

    return (
        <PageLayout>
            <BroadcastAlert />
            <div className="content-box">
                <h1 className="box-title">Your Account</h1>

                <Tabs defaultActiveKey="account">
                    <Tab eventKey="account" title="Account Info">
                        <TabAccount history={history} />
                    </Tab>

                    {currentUser.user_type === "ClinicalServicesUser" ? (
                        <Tab eventKey="documents" title="Documents & Licenses">
                            <TabDocuments />
                        </Tab>
                    ) : null}

                    <Tab eventKey="security" title="Security">
                        <TabSecurity currentUser={currentUser} />
                    </Tab>
                </Tabs>
            </div>
        </PageLayout>
    );
};

export default Account;

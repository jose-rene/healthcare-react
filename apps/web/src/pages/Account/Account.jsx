import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import PageLayout from "../../layouts/PageLayout";
import TabAccount from "./Tabs/TabAccount";
import TabDocuments from "./Tabs/TabDocuments";
import TabSecurity from "./Tabs/TabSecurity";
import "../../styles/account.scss";
import BroadcastAlert from "components/elements/BroadcastAlert";
import { useUser } from "Context/UserContext";
import { _SET_GET, _GET } from "../../helpers/request";

const Account = ({ history }) => {
    const { getUser } = useUser();
    const currentUser = getUser();
    const [activeTab, setActiveTab] = useState(_GET("activeTab", "account"));

    const handleSetActiveTab = (tab) => {
        _SET_GET("activeTab", tab);
        setActiveTab(tab);
    };

    return (
        <PageLayout>
            <BroadcastAlert />
            <div className="content-box">
                <h1 className="box-title">Your Account</h1>

                <Tabs onSelect={handleSetActiveTab} activeKey={activeTab}>
                    <Tab eventKey="account" title="Account Info">
                        <TabAccount history={history} />
                    </Tab>

                    {currentUser.user_type === "ClinicalServicesUser" ? (
                        <Tab eventKey="documents" title="Documents & Licenses">
                            <TabDocuments />
                        </Tab>
                    ) : null}

                    <Tab eventKey="security" title="Security">
                        <TabSecurity history={history} />
                    </Tab>
                </Tabs>
            </div>
        </PageLayout>
    );
};

export default Account;

import React, { useState } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";

import PageLayout from "layouts/PageLayout";

import { useUser } from "Context/UserContext";

import BroadcastAlert from "components/elements/BroadcastAlert";
import PageTitle from "components/PageTitle";

import TabAccount from "./Tabs/TabAccount";
import TabDocuments from "./Tabs/TabDocuments";
import TabSecurity from "./Tabs/TabSecurity";

import { _SET_GET, _GET } from "helpers/request";

import "styles/account.scss";

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
            <Container fluid>
                <PageTitle title="Your Account" hideBack />

                <Tabs onSelect={handleSetActiveTab} activeKey={activeTab}>
                    <Tab
                        eventKey="account"
                        title="Account Info"
                        className="mt-4"
                    >
                        <TabAccount history={history} />
                    </Tab>

                    {currentUser.user_type === "ClinicalServicesUser" ? (
                        <Tab
                            eventKey="documents"
                            title="Documents & Licenses"
                            className="mt-4"
                        >
                            <TabDocuments />
                        </Tab>
                    ) : null}

                    <Tab eventKey="security" title="Security" className="mt-4">
                        <TabSecurity history={history} />
                    </Tab>
                </Tabs>
            </Container>
        </PageLayout>
    );
};

export default Account;

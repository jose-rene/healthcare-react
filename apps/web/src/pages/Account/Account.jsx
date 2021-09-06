import React from "react";
import { connect } from "react-redux";
import { Tabs, Tab } from "react-bootstrap";
import PageLayout from "../../layouts/PageLayout";
import TabAccount from "./Tabs/TabAccount";
import TabDocuments from "./Tabs/TabDocuments";
import TabSecurity from "./Tabs/TabSecurity";
import "../../styles/account.scss";
import BroadcastAlert from "components/elements/BroadcastAlert";

const Account = ({ history, currentUser }) => {
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

const mapStateToProps = ({ auth, user }) => ({
    localAuth: auth,
    currentUser: user,
});

export default connect(mapStateToProps)(Account);

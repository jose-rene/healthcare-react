import React from "react";
import { connect } from "react-redux";
import { Tabs, Tab } from "react-bootstrap";
import PageLayout from "../layouts/PageLayout";
import TabAccount from "./tabs/TabAccount";
import TabDocuments from "./tabs/TabDocuments";
import TabSecurity from "./tabs/TabSecurity";
import "../styles/account.scss";
import BroadcastAlert from "../components/elements/BroadcastAlert";

const Account = ({ user }) => {
    return (
        <PageLayout>
            <BroadcastAlert />
            <div className="content-box">
                <h1 className="box-title">Your Account</h1>

                <Tabs defaultActiveKey="account">
                    <Tab eventKey="account" title="Account Info">
                        <TabAccount user={user} />
                    </Tab>
                    <Tab eventKey="documents" title="Documents & Licenses">
                        <TabDocuments />
                    </Tab>

                    <Tab eventKey="security" title="Security">
                        <TabSecurity />
                    </Tab>
                </Tabs>
            </div>
        </PageLayout>
    );
};

const mapStateToProps = ({ auth, user }) => ({
    localAuth: auth,
    user,
});

export default connect(mapStateToProps)(Account);

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Tabs, Tab, Row } from "react-bootstrap";
import PageLayout from "../layouts/PageLayout";
import TabAccount from "./tabs/TabAccount";
import TabDocuments from "./tabs/TabDocuments";
import TabSecurity from "./tabs/TabSecurity";
import "../styles/account.scss";
import "../styles/account.scss";
import PageAlert from "../components/elements/PageAlert";

const Account = ({ email, full_name }) => {
    return (
        <PageLayout>
            <PageAlert variant="primary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                fringilla finibus odio et rhoncus. Fusce auctor massa at
                dictum interdum. Donec aliquam ante at ex imperdiet
                porttitor.Lorem ipsum dolor sit amet, consectetur adipiscing
                elit. Ut fringilla finibus odio et rhoncus. Fusce auctor
                massa at dictum interdum.
            </PageAlert>


            <div className="content-box">
                <h1 className="box-title">Your Account</h1>

                <Tabs defaultActiveKey="account">
                    <Tab eventKey="account" title="Account Info">
                        <TabAccount />
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

const mapStateToProps = ({ auth, user: { email, full_name } }) => ({
    localAuth: auth,
    email,
    full_name,
});

export default connect(mapStateToProps)(Account);

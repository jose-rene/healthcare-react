import React from "react";
import { Tabs, Tab } from "react-bootstrap";

import PageLayout from "../../../layouts/PageLayout";

import Button from "../../../components/inputs/Button";

import TabCompanyInfo from "./Tabs/TabCompanyInfo";
import TabNarrReports from "./Tabs/TabNarrativeReports/TabNarrativeReports";
import TabRequestTypes from "./Tabs/TabRequestTypes";
import TabPricing from "./Tabs/TabPricing";
import TabCriteria from "./Tabs/TabCriteria";

const AddCompanies = (props) => {
    const handleBack = () => {
        props.history.push("/admin/companies");
    };

    return (
        <PageLayout>
            <div className="content-box">
                <div className="row d-flex justify-content-between p-3">
                    <div className="d-flex">
                        <Button
                            icon="chevron-left"
                            iconSize="sm"
                            className="btn btn-sm mb-5 py-2 px-3"
                            outline
                            label="Back"
                            onClick={() => handleBack()}
                        />

                        <h1 className="box-title ml-4">Add Company</h1>
                    </div>

                    <div className="d-flex">
                        <Button
                            className="btn btn-sm mb-5 py-2 px-3"
                            label="Outcome Report"
                            variant="secondary"
                        />
                    </div>
                </div>

                <Tabs defaultActiveKey="comapnyInfo">
                    <Tab eventKey="comapnyInfo" title="Company Info">
                        <TabCompanyInfo />
                    </Tab>

                    <Tab eventKey="narrReports" title="Narr.Reports">
                        <TabNarrReports />
                    </Tab>

                    <Tab eventKey="requestTypes" title="Request Types">
                        <TabRequestTypes />
                    </Tab>

                    <Tab eventKey="pricing" title="Pricing">
                        <TabPricing />
                    </Tab>

                    <Tab eventKey="criteria" title="Criteria">
                        <TabCriteria />
                    </Tab>
                </Tabs>
            </div>
        </PageLayout>
    );
};

export default AddCompanies;

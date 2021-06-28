import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";

import PageLayout from "../../../layouts/PageLayout";

import Button from "../../../components/inputs/Button";

import TabCompanyInfo from "./Tabs/TabCompanyInfo";
import TabNarrReports from "./Tabs/TabNarrativeReports/TabNarrativeReports";
import TabRequestTypes from "./Tabs/TabRequestTypes";
import TabPricing from "./Tabs/TabPricing";
import TabCriteria from "./Tabs/TabCriteria";
import TabBilling from "./Tabs/TabBilling";
import TabTherapyNetworks from "./Tabs/TabTherapyNetworks";
import TabReviewers from "./Tabs/TabReviewers";
import TabAssocCompanies from "./Tabs/TabAssocCompanies";
import TabGeographicFilters from "./Tabs/TabGeographicFilters";
import TabReports from "./Tabs/TabReports";
import TabTemplates from "./Tabs/TabTemplates";
import TabNotes from "./Tabs/TabNotes";
import TabMisc from "./Tabs/TabMisc";

import useApiCall from "../../../hooks/useApiCall";

const DetailCompanies = (props) => {
    const handleBack = () => {
        props.history.push("/admin/companies");
    };

    const company_id = props.history.location.pathname.split("/")[3];

    const [{ data, loading }, companyDetailRequest] = useApiCall({
        url: `/admin/payer/${company_id}`,
    });

    const [udpateSuccess, setUpdateSuccess] = useState(false);
    const [companyInfoActiveTab, setCompanyInfoActiveTab] = useState(
        "contact-methods"
    );

    useEffect(() => {
        companyDetailRequest();
    }, [udpateSuccess]);

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
                        <TabCompanyInfo
                            data={data}
                            udpateSuccess={udpateSuccess}
                            companyInfoActiveTab={companyInfoActiveTab}
                            setCompanyInfoActiveTab={setCompanyInfoActiveTab}
                            setUpdateSuccess={setUpdateSuccess}
                        />
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

                    <Tab eventKey="billing" title="Billing">
                        <TabBilling />
                    </Tab>

                    <Tab eventKey="therapyNetworks" title="Therapy Networks">
                        <TabTherapyNetworks />
                    </Tab>

                    <Tab eventKey="reviewers" title="Reviewers">
                        <TabReviewers />
                    </Tab>

                    <Tab eventKey="assocCompanies" title="Assoc.Companies">
                        <TabAssocCompanies />
                    </Tab>

                    <Tab
                        eventKey="geographicFilters"
                        title="Geographic Filters"
                    >
                        <TabGeographicFilters />
                    </Tab>

                    <Tab eventKey="reports" title="Reports">
                        <TabReports />
                    </Tab>

                    <Tab eventKey="templates" title="Templates">
                        <TabTemplates />
                    </Tab>

                    <Tab eventKey="notes" title="Notes">
                        <TabNotes />
                    </Tab>

                    <Tab eventKey="misc" title="Misc">
                        <TabMisc />
                    </Tab>
                </Tabs>
            </div>
        </PageLayout>
    );
};

export default DetailCompanies;

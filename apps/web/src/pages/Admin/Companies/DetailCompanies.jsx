import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";
import PageLayout from "../../../layouts/PageLayout";
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
import PageTitle from "../../../components/PageTitle";

const DetailCompanies = (props) => {
    const { match, history } = props;

    const { id: company_id = false } = match.params || {};

    const [{ data, loading }, companyDetailRequest] = useApiCall();

    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        companyDetailRequest({
            url: `/admin/payer/${company_id}`,
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleBack = () => {
        history.push("/admin/companies");
    };

    return (
        <PageLayout>
            {!loading && (
                <>
                    <PageTitle
                        title={(company_id ? "Edit" : "Add") + " Company"}
                        onBack={handleBack}
                    />

                    <Tabs defaultActiveKey="companyInfo">
                        <Tab eventKey="companyInfo" title="Company Info">
                            <TabCompanyInfo
                                company_id={company_id}
                                data={data}
                                updateSuccess={updateSuccess}
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

                        <Tab
                            eventKey="therapyNetworks"
                            title="Therapy Networks"
                        >
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
                </>
            )}
        </PageLayout>
    );
};

export default DetailCompanies;

import React, { useState } from "react";

import { Tabs, Tab } from "react-bootstrap";

import { Button } from "components";
import TableAPI from "components/elements/TableAPI";
import Select from "components/inputs/Select";
import Checkbox from "components/inputs/Checkbox";
import InputText from "components/inputs/InputText";

const historyTestData = [
    {
        dateStart: "01/11/2017",
        dateEnd: "31/10/2018",
        type: "Summary",
        creationTimestamp: "31/10/2018 12:55:39",
        creationAccount: "Jaguilardme",
    },
];

const customReportsTestData = [
    {
        fileName: "File Name",
        description: "Descriptiopn",
    },
];

const TabReports = () => {
    const [activeTab, setActiveTab] = useState("history");
    const [historyHeader] = useState([
        {
            columnMap: "dateStart",
            label: "Date Start",
            type: String,
        },
        {
            columnMap: "dateEnd",
            label: "Date End",
            type: String,
        },
        {
            columnMap: "type",
            label: "Type",
            type: String,
            disableSortBy: true,
        },
        {
            columnMap: "creationTimestamp",
            label: "Creation Timestamp (PST)",
            type: String,
            disableSortBy: true,
        },
        {
            columnMap: "creationAccount",
            label: "Creation Account",
            type: String,
            disableSortBy: true,
        },
    ]);
    const [customReportsHeader] = useState([
        {
            columnMap: "fileName",
            label: "File Name",
            type: String,
            formatter(fileName) {
                return <InputText placeholder="File Name" />;
            },
        },
        {
            columnMap: "description",
            label: "Description",
            type: String,
            disableSortBy: true,
            formatter(description) {
                return <InputText placeholder="Add description" />;
            },
        },
    ]);

    const handleTabs = (currentTab) => {
        const eventBlockList = ["refresh"];
        if (eventBlockList.indexOf(currentTab) === -1) {
            setActiveTab(currentTab);
        }


    };

    return (
        <div className="row">
            <div className="col-md-12">
                <Tabs
                    defaultActiveKey={activeTab}
                    className="inside-tabs position-relative"
                    activeKey={activeTab}
                    onSelect={handleTabs}
                >
                    <Tab eventKey="history" title="History">
                        <div className="white-box mt-0">
                            <TableAPI
                                searchObj={{}}
                                headers={historyHeader}
                                loading={false}
                                data={historyTestData}
                                dataMeta={{}}
                            />
                        </div>
                    </Tab>

                    <Tab eventKey="autoSend" title="SutoSend">
                        <div className="white-box mt-0">
                            <TableAPI
                                searchObj={{}}
                                headers={[]}
                                loading={false}
                                data={[]}
                                dataMeta={{}}
                            />
                        </div>
                    </Tab>

                    <Tab eventKey="defaults" title="Defaults">
                        <div className="white-box mt-0">
                            <div className="row col-md-12 d-flex">
                                <div className="col-md-4">
                                    <Select
                                        label="Period"
                                        options={[
                                            {
                                                id: "12 months ago",
                                                val: "12 months ago",
                                                title: "12 months ago",
                                            },
                                            {
                                                id: "option1",
                                                val: "option1",
                                                title: "Option 1",
                                            },
                                            {
                                                id: "option2",
                                                val: "option2",
                                                title: "Option 2",
                                            },
                                        ]}
                                    />

                                    <Select
                                        label="Period"
                                        options={[
                                            {
                                                id: "summary",
                                                val: "summary",
                                                title: "Summary",
                                            },
                                            {
                                                id: "option1",
                                                val: "option1",
                                                title: "Option 1",
                                            },
                                            {
                                                id: "option2",
                                                val: "option2",
                                                title: "Option 2",
                                            },
                                        ]}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <div className="d-flex justify-content-between">
                                        <span>Request Classifications</span>
                                        <p>
                                            <u className="text-primary">
                                                toogle all
                                            </u>
                                        </p>
                                    </div>
                                    <div className="form-control outline-checkbox">
                                        <Checkbox
                                            labelLeft
                                            name="chart_review"
                                            label="Chart Review"
                                        />
                                    </div>
                                    <div className="form-control outline-checkbox mt-3">
                                        <Checkbox
                                            labelLeft
                                            name="complex_assessment"
                                            label="Complex Assessment"
                                        />
                                    </div>
                                    <div className="form-control outline-checkbox mt-3">
                                        <Checkbox
                                            labelLeft
                                            name="em_home_assessment"
                                            label="EM-Home Assessment"
                                        />
                                    </div>
                                    <div className="form-control outline-checkbox mt-3">
                                        <Checkbox
                                            labelLeft
                                            name="home_modification"
                                            label="Home Modification"
                                        />
                                    </div>
                                    <div className="form-control outline-checkbox mt-3">
                                        <Checkbox
                                            labelLeft
                                            name="home_modification"
                                            label="Home Modification"
                                        />
                                    </div>
                                    <div className="form-control outline-checkbox mt-3">
                                        <Checkbox
                                            labelLeft
                                            name="in_home_assessment"
                                            label="In-Home Assessment"
                                        />
                                    </div>
                                    <div className="form-control outline-checkbox mt-3">
                                        <Checkbox
                                            labelLeft
                                            name="speech_device_chart_review"
                                            label="Speech Device - Chart Review"
                                        />
                                    </div>
                                    <div className="form-control outline-checkbox mt-3 mb-3">
                                        <Checkbox
                                            labelLeft
                                            name="workplace_ergonomic_assessment"
                                            label="Workplace Ergonomic Assessment"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="d-flex justify-content-between">
                                        <span>Lines of Business</span>
                                        <p>
                                            <u className="text-primary">
                                                toogle all
                                            </u>
                                        </p>
                                    </div>
                                    <div className="form-control outline-checkbox">
                                        <Checkbox
                                            labelLeft
                                            name="duals"
                                            label="Duals (SNP)"
                                        />
                                    </div>
                                    <div className="form-control outline-checkbox mt-3">
                                        <Checkbox
                                            labelLeft
                                            name="group_health"
                                            label="GroupHealth"
                                        />
                                    </div>
                                    <div className="form-control outline-checkbox mt-3">
                                        <Checkbox
                                            labelLeft
                                            name="medi_cal"
                                            label="MediCal"
                                        />
                                    </div>
                                    <div className="form-control outline-checkbox mt-3">
                                        <Checkbox
                                            labelLeft
                                            name="medicare"
                                            label="Medicare"
                                        />
                                    </div>
                                    <div className="form-control outline-checkbox mt-3">
                                        <Checkbox
                                            labelLeft
                                            name="home_modification"
                                            label="Home Modification"
                                        />
                                    </div>
                                    <div className="form-control outline-checkbox mt-3">
                                        <Checkbox
                                            labelLeft
                                            name="other"
                                            label="Other"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>

                    <Tab eventKey="customReports" title="Custom Reports">
                        <div className="white-box mt-0">
                            <TableAPI
                                searchObj={{}}
                                headers={customReportsHeader}
                                loading={false}
                                data={customReportsTestData}
                                dataMeta={{}}
                            />
                        </div>
                    </Tab>

                    <Tab
                        eventKey="refresh"
                        tabClassName="position-absolute actions-tab p-0"
                        title={
                            <Button
                                icon="sync-alt"
                                iconSize="sm"
                                outline
                                className="p-2 btn-outline-light border-0 text-dark"
                                label="Refresh"
                            />
                        }
                    />
                </Tabs>
            </div>
        </div>
    );
};

export default TabReports;

import React, { useState } from "react";

import { Tabs, Tab } from "react-bootstrap";

import Button from "../../../../components/inputs/Button";
import TableAPI from "../../../../components/elements/TableAPI";
import Select from "../../../../components/inputs/Select";
import InputText from "../../../../components/inputs/InputText";
import Textarea from "../../../../components/inputs/Textarea";

const TabTemplates = () => {
    const [activeTab, setActiveTab] = useState("alert-templates");

    const [header] = useState([
        {
            columnMap: "name",
            label: "Name",
            type: String,
        },
    ]);

    const handleTabs = (currentTab) => {
        const eventBlockList = ["add"];
        if (eventBlockList.indexOf(currentTab) === -1) {
            setActiveTab(currentTab);
        }

        return;
    };

    return (
        <div className="row">
            <div className="col-md-6 mt-4">
                <Tabs
                    defaultActiveKey={activeTab}
                    className="inside-tabs position-relative mt-0"
                    activeKey={activeTab}
                    onSelect={handleTabs}
                >
                    <Tab eventKey="alert-templates" title="Alert Templates">
                        <div className="white-box mt-0">
                            <TableAPI
                                searchObj={{}}
                                headers={header}
                                loading={false}
                                data={[]}
                                dataMeta={{}}
                            />
                        </div>
                    </Tab>

                    <Tab eventKey="email-templates" title="Email Templates">
                        <div className="white-box mt-0">Email Templates</div>
                    </Tab>

                    <Tab
                        eventKey="add"
                        tabClassName="position-absolute actions-tab p-0"
                        title={
                            <Button
                                icon="plus"
                                iconSize="sm"
                                className="p-2"
                                label="Add"
                            />
                        }
                    />
                </Tabs>
            </div>
            <div className="col-md-6 mt-4">
                <div>Detail</div>
                <div className="white-box white-box-small">
                    <div className="row d-flex">
                        <div className="col-md-5">
                            <Select
                                label="Type"
                                options={[
                                    {
                                        id: "Activity Update",
                                        val: "activity update",
                                        title: "activity update",
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
                        <div className="col-md-7">
                            <InputText
                                label="Subject"
                                value="Activity Update"
                            />
                        </div>
                    </div>

                    <div className="row ml-0">
                        <div className="col-md-12 pl-0">
                            <Textarea
                                className="form-control custom-textarea-input"
                                label="Body"
                                value="Activity Update"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TabTemplates;

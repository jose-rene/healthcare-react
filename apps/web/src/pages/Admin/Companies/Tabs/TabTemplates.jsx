import React, { useState } from "react";

import { Tabs, Tab, Row, Col } from "react-bootstrap";

import { Button } from "components";
import TableAPI from "components/elements/TableAPI";
import Select from "components/inputs/Select";
import InputText from "components/inputs/InputText";
import Textarea from "components/inputs/Textarea";

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
    };

    return (
        <Row className="mt-4">
            <Col md={6}>
                <Tabs
                    defaultActiveKey={activeTab}
                    className="inside-tabs position-relative mt-0"
                    activeKey={activeTab}
                    onSelect={handleTabs}
                >
                    <Tab eventKey="alert-templates" title="Alert Templates">
                        <Row className="py-4 bg-white mx-0">
                            <Col md={12}>
                                <TableAPI
                                    searchObj={{}}
                                    headers={header}
                                    loading={false}
                                    data={[]}
                                    dataMeta={{}}
                                />
                            </Col>
                        </Row>
                    </Tab>

                    <Tab eventKey="email-templates" title="Email Templates">
                        <Row className="py-4 bg-white mx-0">
                            <Col md={12}>Email Templates</Col>
                        </Row>
                    </Tab>

                    <Tab
                        eventKey="add"
                        tabClassName="position-absolute actions-tab p-0"
                        title={
                            <Button
                                icon="plus"
                                iconSize="sm"
                                className="py-1"
                                label="Add"
                            />
                        }
                    />
                </Tabs>
            </Col>

            <Col md={6}>
                <Row className="py-4 bg-white mx-0">
                    <Col md={12}>
                        <h4>Detail</h4>
                    </Col>

                    <Col md={5}>
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
                    </Col>

                    <Col md={7}>
                        <InputText label="Subject" value="Activity Update" />
                    </Col>

                    <Col md={12}>
                        <Textarea
                            className="form-control custom-textarea-input"
                            label="Body"
                            value="Activity Update"
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default TabTemplates;

import React, { useState } from "react";
import { Tabs, Tab, DropdownButton, Dropdown, Row, Col } from "react-bootstrap";

import InputText from "components/inputs/InputText";
import Select from "components/inputs/Select";

const TabBilling = () => {
    const [activeTab, setActiveTab] = useState("billing-submission");
    const [activeDropdown, setActiveDropdown] = useState("Option 1");

    const handleTabs = (currentTab) => {
        const eventBlockList = ["office-ally", "Option 1", "Option 2"];
        if (eventBlockList.indexOf(currentTab) === -1) {
            setActiveTab(currentTab);
        }
    };

    const handleDropdown = (evt) => {
        setActiveDropdown(evt);
    };

    return (
        <Row>
            <Col md={6}>
                <Tabs
                    defaultActiveKey="claims-address"
                    className="inside-tabs position-relative"
                >
                    <Tab eventKey="claims-address" title="Claims Address">
                        <Row className="py-4 bg-white mx-0">
                            <Col md={6}>
                                <InputText
                                    label="Address Line 1"
                                    value="1240 South Loop Road"
                                />
                            </Col>
                            <Col md={6}>
                                <Select
                                    label="City"
                                    options={[
                                        {
                                            id: "alameda",
                                            val: "alameda",
                                            title: "Alameda",
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

                            <Col md={6}>
                                <Select
                                    label="State"
                                    options={[
                                        {
                                            id: "ca",
                                            val: "ca",
                                            title: "CA",
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
                            <Col md={6}>
                                <InputText label="ZIP Code" value="94502" />
                            </Col>

                            <Col md={6}>
                                <Select
                                    label="State"
                                    options={[
                                        {
                                            id: "county",
                                            val: "county",
                                            title: "County",
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
                        </Row>
                    </Tab>

                    <Tab eventKey="rebilling" title="Rebilling">
                        <Row className="py-4 bg-white mx-0">
                            <Col md={6}>
                                <InputText
                                    label="Payment Due"
                                    placeholder="(days)"
                                />
                            </Col>
                            <Col md={6}>
                                <InputText
                                    label="First Rebill"
                                    placeholder="(days)"
                                />
                            </Col>

                            <Col md={6}>
                                <InputText
                                    label="Rebilling Period"
                                    placeholder="(days)"
                                />
                            </Col>
                        </Row>
                    </Tab>

                    <Tab eventKey="billing-contact" title="Billing Contact">
                        <Row className="py-4 bg-white mx-0">
                            <Col md={6}>
                                <InputText label="Name" value="Jacob Jones" />
                            </Col>

                            <Col md={6}>
                                <InputText
                                    label="Email"
                                    value="jacob@mail.com"
                                />
                            </Col>

                            <Col md={6}>
                                <InputText
                                    label="Phone"
                                    value="(406) 555-0120"
                                />
                            </Col>
                        </Row>
                    </Tab>
                </Tabs>
            </Col>
            <Col md={6}>
                <Tabs
                    defaultActiveKey={activeTab}
                    className="inside-tabs position-relative"
                    activeKey={activeTab}
                    onSelect={handleTabs}
                >
                    <Tab
                        eventKey="billing-submission"
                        title="Billing Submission"
                    >
                        <Row className="py-4 bg-white mx-0">
                            <Col md={6}>
                                <InputText
                                    label="Billing Provider"
                                    value="1240 South Loop Road"
                                />
                            </Col>
                            <Col md={6}>
                                <InputText
                                    label="Address"
                                    value="548 Market Street Suite 75842"
                                />
                            </Col>

                            <Col md={6}>
                                <Select
                                    label="City"
                                    options={[
                                        {
                                            id: "san francisco",
                                            val: "san francisco",
                                            title: "San Francisco",
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

                            <Col md={6}>
                                <Row>
                                    <Col md={6}>
                                        <Select
                                            label="State"
                                            options={[
                                                {
                                                    id: "alameda",
                                                    val: "alameda",
                                                    title: "Alameda",
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
                                    <Col md={6}>
                                        <InputText
                                            label="ZIP Code"
                                            value="2464"
                                        />
                                    </Col>
                                </Row>
                            </Col>

                            <Col md={6}>
                                <InputText label="Payer ID" value="95237" />
                            </Col>
                            <Col md={6}>
                                <InputText label="Phone" value="866-886-9992" />
                            </Col>
                        </Row>
                    </Tab>

                    <Tab eventKey="payments/po" title="Payments / PO">
                        <Row className="py-4 bg-white mx-0">
                            <Col md={6}>
                                <Select
                                    label="Default Payment Type"
                                    options={[
                                        {
                                            id: "mastercard",
                                            val: "mastercard",
                                            title: "Mastercard",
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

                            <Col md={6}>
                                <InputText
                                    label="Reference Number Label"
                                    value="0"
                                />
                            </Col>

                            <Col md={6}>
                                <InputText label="PO Number" value="0" />
                            </Col>
                        </Row>
                    </Tab>

                    <Tab
                        eventKey="office-ally"
                        tabClassName="position-absolute actions-tab"
                        title={
                            <DropdownButton
                                id="office-ally"
                                title={activeDropdown}
                                variant="default"
                                className="tab-dropdown"
                                onSelect={handleDropdown}
                            >
                                <Dropdown.Item
                                    eventKey="Option 1"
                                    className="text-dark"
                                >
                                    Option 1
                                </Dropdown.Item>
                                <Dropdown.Item
                                    eventKey="Option 2"
                                    className="text-dark"
                                >
                                    Option 2
                                </Dropdown.Item>
                            </DropdownButton>
                        }
                    />
                </Tabs>
            </Col>
        </Row>
    );
};

export default TabBilling;

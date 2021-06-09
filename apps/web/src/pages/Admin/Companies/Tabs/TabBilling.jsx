import React, { useState } from "react";
import { Tabs, Tab, DropdownButton, Dropdown } from "react-bootstrap";

import InputText from "../../../../components/inputs/InputText";
import Select from "../../../../components/inputs/Select";

const TabBilling = () => {
    const [activeTab, setActiveTab] = useState("billing-submission");
    const [activeDropdown, setActiveDropdown] = useState("Option 1");

    const handleTabs = (currentTab) => {
        const eventBlockList = ["office-ally", "Option 1", "Option 2"];
        if (eventBlockList.indexOf(currentTab) === -1) {
            setActiveTab(currentTab);
        }

        return;
    };

    const handleDropdown = (evt) => {
        setActiveDropdown(evt);
    };

    return (
        <div className="row">
            <div className="col-md-6">
                <Tabs
                    defaultActiveKey="claims-address"
                    className="inside-tabs position-relative"
                >
                    <Tab eventKey="claims-address" title="Claims Address">
                        <div className="white-box mt-0">
                            <div className="row">
                                <div className="col-md-6">
                                    <InputText
                                        label="Address Line 1"
                                        value="1240 South Loop Road"
                                    />
                                </div>
                                <div className="col-md-6">
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
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
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
                                </div>
                                <div className="col-md-6">
                                    <InputText label="ZIP Code" value="94502" />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
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
                                </div>
                            </div>
                        </div>
                    </Tab>

                    <Tab eventKey="rebilling" title="Rebilling">
                        <div className="white-box mt-0">
                            <div className="row">
                                <div className="col-md-6">
                                    <InputText
                                        label="Payment Due"
                                        placeholder="(days)"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <InputText
                                        label="First Rebill"
                                        placeholder="(days)"
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <InputText
                                        label="Rebilling Period"
                                        placeholder="(days)"
                                    />
                                </div>
                            </div>
                        </div>
                    </Tab>

                    <Tab eventKey="billing-contact" title="Billing Contact">
                        <div className="white-box mt-0">
                            <div className="row">
                                <div className="col-md-6">
                                    <InputText
                                        label="Name"
                                        value="Jacob Jones"
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <InputText
                                        label="Email"
                                        value="jacob@mail.com"
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <InputText
                                        label="Phone"
                                        value="(406) 555-0120"
                                    />
                                </div>
                            </div>
                        </div>
                    </Tab>
                </Tabs>
            </div>
            <div className="col-md-6">
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
                        <div className="white-box mt-0">
                            <div className="row">
                                <div className="col-md-6">
                                    <InputText
                                        label="Billing Provider"
                                        value="1240 South Loop Road"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <InputText
                                        label="Address"
                                        value="548 Market Street Suite 75842"
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
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
                                </div>
                                <div className="col-md-6 d-flex">
                                    <div className="col-md-6 pl-0">
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
                                    </div>
                                    <div className="col-md-6 pr-0">
                                        <InputText
                                            label="ZIP Code"
                                            value="2464"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <InputText title="Payer ID" value="95237" />
                                </div>
                                <div className="col-md-6">
                                    <InputText
                                        title="Phone"
                                        value="866-886-9992"
                                    />
                                </div>
                            </div>
                        </div>
                    </Tab>

                    <Tab eventKey="payments/po" title="Payments / PO">
                        <div className="white-box mt-0">
                            <div className="row">
                                <div className="col-md-6">
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
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <InputText
                                        label="Reference Number Label"
                                        value="0"
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <InputText label="PO Number" value="0" />
                                </div>
                            </div>
                        </div>
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
            </div>
        </div>
    );
};

export default TabBilling;

import React, { useState } from "react";

import { Tabs, Tab } from "react-bootstrap";

import TableAPI from "../../../../components/elements/TableAPI";
import InputText from "../../../../components/inputs/InputText";
import Checkbox from "../../../../components/inputs/Checkbox";
import Select from "../../../../components/inputs/Select";
import Icon from "../../../../components/elements/Icon";
import Button from "../../../../components/inputs/Button";

import { ACTIONS } from "../../../../helpers/table";

const contactTestData = [
    {
        id: "contactTestData",
        description: "Home",
        number: "(702) 555-0122",
    },
];

const adressTestData = [
    {
        id: "addressTestData",
        type: "Mailing",
        address: "211 Hope St",
        city: "Mountain View",
        state: "CA",
        zip: "94-41",
    },
];

const TabCompanyInfo = () => {
    const [contactHeaders] = useState([
        {
            columnMap: "description",
            label: "Description",
            type: String,
            disableSortBy: true,
        },
        {
            columnMap: "number",
            label: "Number",
            type: String,
            disableSortBy: true,
        },
        {
            columnMap: "id",
            label: "Actions",
            type: ACTIONS,
            disableSortBy: true,
            formatter(id) {
                return (
                    <>
                        <Icon
                            size="1x"
                            icon="edit"
                            className="mr-2 bg-primary text-white rounded-circle p-1"
                        />
                        <Icon
                            size="1x"
                            icon="trash-alt"
                            className="bg-danger text-white rounded-circle p-1"
                        />
                    </>
                );
            },
        },
    ]);

    const [addressHeaders] = useState([
        {
            columnMap: "type",
            label: "Type",
            type: String,
            disableSortBy: true,
        },
        {
            columnMap: "address",
            label: "Address",
            type: String,
            disableSortBy: true,
        },
        {
            columnMap: "city",
            label: "City",
            type: String,
            disableSortBy: true,
        },
        {
            columnMap: "state",
            label: "State",
            type: String,
            disableSortBy: true,
        },
        {
            columnMap: "zip",
            label: "Zip",
            type: String,
            disableSortBy: true,
        },
        {
            columnMap: "id",
            label: "Actions",
            type: ACTIONS,
            disableSortBy: true,
            formatter(id) {
                return (
                    <>
                        <Icon
                            size="1x"
                            icon="edit"
                            className="mr-2 bg-primary text-white rounded-circle p-1"
                        />
                        <Icon
                            size="1x"
                            icon="trash-alt"
                            className="bg-danger text-white rounded-circle p-1"
                        />
                    </>
                );
            },
        },
    ]);

    return (
        <>
            <div className="white-box white-box-small">
                <div className="row">
                    <div className="col-md-3">
                        <InputText
                            name="name"
                            label="Name"
                            placeholder="Name"
                        />
                    </div>
                    <div className="col-md-3">
                        <div className="form-control custom-checkbox">
                            <Checkbox labelLeft name="molina" label="Molina" />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <InputText
                            name="abbreviation"
                            label="Abbreviation"
                            placeholder="Name"
                        />
                    </div>
                    <div className="col-md-3">
                        <InputText
                            name="member-id-types"
                            label="Member ID Types"
                            placeholder="MediCaid"
                        />
                    </div>
                    <div className="col-md-3">
                        <Select
                            name="category"
                            label="Category"
                            options={[
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
                    <div className="col-md-3">
                        <Select
                            name="subCategory"
                            label="Sub Category"
                            options={[
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
                    <div className="col-md-3">
                        <InputText
                            name="assessment-label"
                            label="Assessment Label"
                            placeholder="Placeholder"
                        />
                    </div>
                    <div className="col-md-3">
                        <div className="form-control custom-checkbox">
                            <Checkbox
                                labelLeft
                                name="molina"
                                label="Includes PHI"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-6 pl-0">
                <Button
                    icon="plus"
                    iconSize="sm"
                    label="Add"
                    className="float-right p-2"
                />

                <Tabs
                    defaultActiveKey="contact-methods"
                    className="inside-tabs"
                >
                    <Tab eventKey="contact-methods" title="Contact Methods">
                        <div className="white-box mt-0">
                            <TableAPI
                                searchObj={{}}
                                headers={contactHeaders}
                                loading={false}
                                data={contactTestData}
                                dataMeta={{}}
                            />
                        </div>
                    </Tab>

                    <Tab eventKey="addresses" title="Addresses">
                        <div className="white-box mt-0">
                            <TableAPI
                                searchObj={{}}
                                headers={addressHeaders}
                                loading={false}
                                data={adressTestData}
                                dataMeta={{}}
                            />
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </>
    );
};

export default TabCompanyInfo;

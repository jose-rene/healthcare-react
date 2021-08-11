import React, { useState } from "react";

import { Tabs, Tab } from "react-bootstrap";

import { Button } from "components";
import TableAPI from "components/elements/TableAPI";
import InputText from "components/inputs/InputText";
import Checkbox from "components/inputs/Checkbox";
import Icon from "components/elements/Icon";

import { ACTIONS } from "../../../../helpers/table";

const testData = [
    {
        name: "GroupHealth",
        description: "",
        tat: false,
    },
    {
        name: "MediCal",
        description: "",
        tat: false,
    },
];

const TabMisc = () => {
    const [headers] = useState([
        {
            columnMap: "name",
            label: "Name",
            type: String,
            disableSortBy: true,
            formatter(name) {
                return <InputText value={name} />;
            },
        },
        {
            columnMap: "description",
            label: "Description",
            type: String,
            disableSortBy: true,
            formatter(description) {
                return <InputText value={description} />;
            },
        },
        {
            columnMap: "tat",
            label: "TAT",
            type: ACTIONS,
            disableSortBy: true,
            formatter(tat) {
                return (
                    <Checkbox
                        inline
                        className="px-auto header-checkbox"
                        value={tat}
                    />
                );
            },
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
                            icon="info-circle"
                            className="me-2 bg-secondary text-white rounded-circle p-1"
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
            <div className="row mt-4">
                <div className="col-md-6">
                    <span className="title-linesBusiness">
                        Lines of Business
                    </span>
                    <Button
                        className="p-2 ml-4"
                        icon="plus"
                        iconSize="sm"
                        label="Add"
                    />
                </div>
                <div className="col-md-6">
                    <div className="d-flex justify-content-end algin-items-center">
                        <Button
                            outline
                            className="px-0 py-2 btn-outline-light border-0 text-dark"
                            icon="eye-slash"
                            iconSize="sm"
                            label="Show Desactivated"
                        />
                    </div>
                </div>
            </div>

            <div className="row mx-0">
                <div className="white-box mt-0">
                    <TableAPI
                        searchObj={{}}
                        headers={headers}
                        loading={false}
                        data={testData}
                        dataMeta={{}}
                    />
                </div>
            </div>

            <Tabs
                defaultActiveKey="per-request-averages"
                className="inside-tabs position-relative"
            >
                <Tab
                    eventKey="per-request-averages"
                    title="Per-Request Averages"
                >
                    <div className="white-box mt-0 d-flex row ml-0">
                        <div className="col-lg-3 col-md-6">
                            <InputText label="High" value="0" />
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <InputText label="Low" value="0" />
                        </div>
                    </div>
                </Tab>

                <Tab eventKey="next-invoice-number" title="Next Invoice Number">
                    <div className="white-box mt-0 d-flex row ml-0">
                        <div className="col-lg-3 col-md-6">
                            <InputText
                                label="Next Invoice Number"
                                value="123456"
                            />
                        </div>
                    </div>
                </Tab>

                <Tab eventKey="website-url" title="Website URL">
                    <div className="white-box mt-0 d-flex row ml-0">
                        <div className="col-lg-3 col-md-6">
                            <InputText
                                label="Website URL"
                                value="https://google.com"
                            />
                        </div>
                    </div>
                </Tab>

                <Tab eventKey="turn-around-times" title="Turn-Around Times">
                    <div className="white-box mt-0 d-flex row ml-0">
                        <div className="col-lg-3 col-md-6">
                            <InputText
                                label="Hours before due to turn yellow"
                                value="2 hours"
                            />
                        </div>

                        <div className="col-lg-3 col-md-6">
                            <InputText
                                label="Hours before due to turn red"
                                value="2 hours"
                            />
                        </div>

                        <div className="col-lg-3 col-md-6">
                            <InputText label="Default time" value="2 hours" />
                        </div>
                    </div>
                </Tab>
            </Tabs>
        </>
    );
};

export default TabMisc;

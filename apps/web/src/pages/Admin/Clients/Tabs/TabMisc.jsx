import React, { useState } from "react";

import { Tabs, Tab, Row, Col } from "react-bootstrap";

import { Button } from "components";
import TableAPI from "components/elements/TableAPI";
import InputText from "components/inputs/InputText";
import Checkbox from "components/inputs/Checkbox";
import FapIcon from "components/elements/FapIcon";

import { ACTIONS } from "helpers/table";

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
                        <FapIcon
                            className="mx-1"
                            size="1x"
                            icon="info-circle"
                        />
                        <FapIcon className="mx-1" size="1x" icon="trash-alt" />
                    </>
                );
            },
        },
    ]);

    return (
        <Row className="mt-4">
            <Col md={6}>
                <span className="title-linesBusiness">Lines of Business</span>
                <Button
                    className="py-1 mx-4"
                    icon="plus"
                    iconSize="sm"
                    label="Add"
                />
            </Col>
            <Col md={6}>
                <div className="d-flex justify-content-end algin-items-center">
                    <Button
                        outline
                        className="py-1 mx-2"
                        icon="eye-slash"
                        iconSize="sm"
                        label="Show Desactivated"
                    />
                </div>
            </Col>

            <Col md={12} className="mt-4">
                <TableAPI
                    searchObj={{}}
                    headers={headers}
                    loading={false}
                    data={testData}
                    dataMeta={{}}
                />
            </Col>

            <Col md={12}>
                <Tabs
                    defaultActiveKey="per-request-averages"
                    className="inside-tabs position-relative"
                >
                    <Tab
                        eventKey="per-request-averages"
                        title="Per-Request Averages"
                    >
                        <Row className="pt-4 bg-white mx-0">
                            <Col md={6} lg={3}>
                                <InputText label="High" value="0" />
                            </Col>
                            <Col md={6} lg={3}>
                                <InputText label="Low" value="0" />
                            </Col>
                        </Row>
                    </Tab>

                    <Tab
                        eventKey="next-invoice-number"
                        title="Next Invoice Number"
                    >
                        <Row className="pt-4 bg-white mx-0">
                            <Col md={6} lg={3}>
                                <InputText
                                    label="Next Invoice Number"
                                    value="123456"
                                />
                            </Col>
                        </Row>
                    </Tab>

                    <Tab eventKey="website-url" title="Website URL">
                        <Row className="pt-4 bg-white mx-0">
                            <Col md={6} lg={3}>
                                <InputText
                                    label="Website URL"
                                    value="https://google.com"
                                />
                            </Col>
                        </Row>
                    </Tab>

                    <Tab eventKey="turn-around-times" title="Turn-Around Times">
                        <Row className="pt-4 bg-white mx-0">
                            <Col md={6} lg={3}>
                                <InputText
                                    label="Hours before due to turn yellow"
                                    value="2 hours"
                                />
                            </Col>

                            <Col md={6} lg={3}>
                                <InputText
                                    label="Hours before due to turn red"
                                    value="2 hours"
                                />
                            </Col>

                            <Col md={6} lg={3}>
                                <InputText
                                    label="Default time"
                                    value="2 hours"
                                />
                            </Col>
                        </Row>
                    </Tab>
                </Tabs>
            </Col>
        </Row>
    );
};

export default TabMisc;

import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";

import { Button } from "components";
import Select from "components/inputs/Select";
import TableAPI from "components/elements/TableAPI";
import FapIcon from "components/elements/FapIcon";
import Checkbox from "components/inputs/Checkbox";
import Modal from "components/elements/Modal";

import { ACTIONS } from "helpers/table";

const testData = [
    {
        category: "Railing",
        requestType: "Stair Railings (Interior &/Or Exterior)",
        amount: "000000",
        therapistRate: "000000",
        uniqueMod: "000000",
        hcpcs: "E0241",
        cpt: "000000",
        pca: false,
    },
];

const TabReuqestTypes = () => {
    const [showModal, setShowModal] = useState(false);

    const [headers] = useState([
        {
            columnMap: "category",
            label: "Category",
            type: String,
        },
        {
            columnMap: "requestType",
            label: "Request Type",
            type: String,
            disableSortBy: true,
        },
        {
            columnMap: "amount",
            label: "Amount",
            type: String,
        },
        {
            columnMap: "therapistRate",
            label: "Therapist Rate",
            type: String,
        },
        {
            columnMap: "uniqueMod",
            label: "Unique Mod",
            type: String,
        },
        {
            columnMap: "hcpcs",
            label: "HCPCS",
            type: String,
        },
        {
            columnMap: "cpt",
            label: "CPT",
            type: String,
        },
        {
            columnMap: "pca",
            label: "PCA",
            type: ACTIONS,
            disableSortBy: true,
            formatter(pca) {
                return (
                    <Checkbox
                        inline
                        className="px-auto header-checkbox"
                        value={pca}
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
                            size="1x"
                            icon="info-circle"
                            className="mx-1"
                        />
                        <FapIcon size="1x" icon="trash-alt" className="mx-1" />
                    </>
                );
            },
        },
    ]);

    const [modalHeaders] = useState([
        {
            columnMap: "category",
            label: "Category",
            type: String,
        },
        {
            columnMap: "requestType",
            label: "Request Type",
            type: String,
            disableSortBy: true,
        },
    ]);

    const handleModal = () => {
        setShowModal(!showModal);
    };

    return (
        <>
            <Row className=" mt-4">
                <Col md={5}></Col>
                <Col md={3}>
                    <Select
                        inlineLabel
                        label="Classification"
                        options={[
                            {
                                id: "all",
                                val: "all",
                                title: "All",
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
                <Col md={3}>
                    <Select
                        inlineLabel
                        label="Category"
                        options={[
                            {
                                id: "all",
                                val: "all",
                                title: "All",
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
                <Col>
                    <Button
                        className="p-2"
                        label="Add"
                        icon="plus"
                        iconSize="sm"
                        onClick={() => handleModal()}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <TableAPI
                        searchObj={{}}
                        headers={headers}
                        loading={false}
                        data={testData}
                        dataMeta={{}}
                    />
                </Col>
            </Row>

            <Modal
                show={showModal}
                onHide={handleModal}
                title="Add/Remove Request Types"
                hasClose
            >
                <Row>
                    <Col md={12}>
                        <Row>
                            <Col md={5}>
                                <Select
                                    label="Classification"
                                    options={[
                                        {
                                            id: "all",
                                            val: "all",
                                            title: "All",
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
                            <Col md={5}>
                                <Select
                                    label="Category"
                                    options={[
                                        {
                                            id: "all",
                                            val: "all",
                                            title: "All",
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
                            <Col md={2}>
                                <Button className="p-2" label="Add" block />
                            </Col>

                            <Col md={12}>
                                <TableAPI
                                    searchObj={{}}
                                    headers={modalHeaders}
                                    loading={false}
                                    data={testData}
                                    dataMeta={{}}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default TabReuqestTypes;

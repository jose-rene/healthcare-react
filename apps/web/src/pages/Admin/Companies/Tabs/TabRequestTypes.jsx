import React, { useState } from "react";

import Select from "../../../../components/inputs/Select";
import Button from "../../../../components/inputs/Button";
import TableAPI from "../../../../components/elements/TableAPI";
import Icon from "../../../../components/elements/Icon";
import Checkbox from "../../../../components/inputs/Checkbox";
import Modal from "../../../../components/elements/Modal";

import { ACTIONS } from "../../../../helpers/table";

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
                        <Icon
                            size="1x"
                            icon="info-circle"
                            className="mr-2 bg-secondary text-white rounded-circle p-1"
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
            <div className="row mt-4 d-flex justify-content-end">
                <div className="col-md-6 col-lg-3">
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
                </div>
                <div className="col-md-6 col-lg-3">
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
                </div>
                <div className="col-auto">
                    <Button
                        className="p-1"
                        label="Add"
                        icon="plus"
                        iconSize="sm"
                        onClick={() => handleModal()}
                    />
                </div>
            </div>

            <div className="white-box white-box-small">
                <TableAPI
                    searchObj={{}}
                    headers={headers}
                    loading={false}
                    data={testData}
                    dataMeta={{}}
                />
            </div>

            <Modal
                show={showModal}
                onHide={handleModal}
                title="Add/Remove Request Types"
                hasClose
            >
                <div className="col-md-12">
                    <div className="row d-flex justify-content-end">
                        <div className="col-md-5">
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
                        </div>
                        <div className="col-md-5">
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
                        </div>
                        <div className="col-md-2">
                            <Button
                                className="p-1 modal-add-button"
                                label="Add"
                                icon="plus"
                                iconSize="sm"
                            />
                        </div>
                    </div>

                    <div className="row p-3">
                        <TableAPI
                            searchObj={{}}
                            headers={modalHeaders}
                            loading={false}
                            data={testData}
                            dataMeta={{}}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default TabReuqestTypes;

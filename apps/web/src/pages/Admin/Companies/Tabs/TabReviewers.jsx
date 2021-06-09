import React, { useState } from "react";

import Button from "../../../../components/inputs/Button";
import TableAPI from "../../../../components/elements/TableAPI";
import Icon from "../../../../components/elements/Icon";

import { ACTIONS } from "../../../../helpers/table";

const testData = [
    {
        id: "id",
        name: "HealthPlan Of San Mateo",
    },
];

const TabReviewers = () => {
    const [headers] = useState([
        {
            columnMap: "name",
            label: "Name",
            type: String,
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
        <div className="row">
            <div className="col-md-6">
                <div className="d-flex justify-content-between mt-4">
                    <h1 className="box-subtitle">Associated Reviewers</h1>
                    <Button icon="plus" iconSize="sm" label="Add" />
                </div>

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
            <div className="col-md-6">
                <h1 className="box-subtitle mt-4">External Abbreviations</h1>

                <div className="white-box external-abbreviations mt-0"></div>
            </div>
        </div>
    );
};

export default TabReviewers;

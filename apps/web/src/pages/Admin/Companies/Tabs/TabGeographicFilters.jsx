import React, { useState } from "react";

import Select from "components/inputs/Select";
import { Button } from "components";
import TableAPI from "components/elements/TableAPI";
import Icon from "components/elements/Icon";

import { ACTIONS } from "../../../../helpers/table";

const testData = [
    {
        id: "id",
        filterType: "ZIP Code",
        data: "San Francisco",
    },
];

const GeographicFilters = () => {
    const [headers] = useState([
        {
            columnMap: "filterType",
            label: "Filter Type",
            type: String,
        },
        {
            columnMap: "data",
            label: "Data",
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
                    <Icon
                        size="1x"
                        icon="trash-alt"
                        className="bg-danger text-white rounded-circle p-1"
                    />
                );
            },
        },
    ]);

    return (
        <>
            <div className="row col-lg-8 col-md-12">
                <div className="white-box row ml-0 pe-4">
                    <div className="col-md-5">
                        <Select
                            inlineLabel
                            name="filterType"
                            label="Filter Type"
                            options={[
                                {
                                    id: "city",
                                    val: "city",
                                    title: "City",
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
                            inlineLabel
                            name="data"
                            label="Data"
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

                    <div className="col-md-2">
                        <Button
                            className="p-1"
                            icon="plus"
                            iconSize="sm"
                            label="Add"
                        />
                    </div>
                </div>
            </div>

            <div className="row mt-5 col-lg-8 col-md-12">
                <h1 className="box-subtitle">Geographic Filters</h1>
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
        </>
    );
};

export default GeographicFilters;

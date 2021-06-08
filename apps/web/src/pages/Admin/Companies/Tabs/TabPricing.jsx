import React, { useState } from "react";

import InputText from "../../../../components/inputs/InputText";
import Select from "../../../../components/inputs/Select";
import Button from "../../../../components/inputs/Button";
import TableAPI from "../../../../components/elements/TableAPI";

const testData = [
    {
        locationAreas: "Placeholder",
        chartReview: "$1000",
        inHomeAssessment: "$1000",
        support: "$1000",
    },
];

const TabPricing = () => {
    const [headers] = useState([
        {
            columnMap: "locationAreas",
            label: "Location Areas",
            type: String,
        },
        {
            columnMap: "chartReview",
            label: "Chart Review",
            type: String,
            formatter(chartReview) {
                return <InputText value={chartReview} />;
            },
        },
        {
            columnMap: "inHomeAssessment",
            label: "In-Home Assessment",
            type: String,
            disableSortBy: true,
            formatter(inHomeAssessment) {
                return <InputText value={inHomeAssessment} />;
            },
        },
        {
            columnMap: "support",
            label: "Support",
            type: String,
            disableSortBy: true,
            formatter(support) {
                return <InputText value={support} />;
            },
        },
    ]);

    return (
        <>
            <div className="row mt-4 d-flex justify-content-end">
                <div className="col-md-6">
                    <div className="d-flex justify-content-end">
                        <Select
                            inlineLabel
                            label="Template"
                            className="mr-2"
                            placeholder="Select"
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

                        <Button
                            outline
                            label="Hide Empty"
                            variant="warn"
                            className="btn btn-light pricing-hide-button"
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="d-flex align-items-baseline justify-content-between">
                        <label className="mr-2">No Show Fee</label>
                        <InputText placeholder="$250,00" />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="d-flex align-items-baseline justify-content-between">
                        <label className="mr-2">Urgency</label>
                        <InputText placeholder="$250,00" />
                    </div>
                </div>
            </div>

            <div className="row p-3">
                <TableAPI
                    searchObj={{}}
                    headers={headers}
                    loading={false}
                    data={testData}
                    dataMeta={{}}
                />
            </div>
        </>
    );
};

export default TabPricing;

import React, { useState } from "react";

import TableAPI from "components/elements/TableAPI";

import { ACTIONS } from "../../../../helpers/table";

const testData = [{ company: "DME Consulting, Inc" }];

const TabTherapyNetwork = () => {
    const [headers] = useState([
        {
            columnMap: "company",
            label: "Company",
            type: ACTIONS,
            disableSortBy: true,
        },
    ]);

    return (
        <div className="white-box white-box-small">
            <TableAPI
                searchObj={{}}
                headers={headers}
                loading={false}
                data={testData}
                dataMeta={{}}
            />
        </div>
    );
};

export default TabTherapyNetwork;

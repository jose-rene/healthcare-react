import React, { useState, useEffect } from "react";

import PageLayout from "../../layouts/PageLayout";
import InputText from "../../components/inputs/InputText";
import Button from "../../components/inputs/Button";
import Select from "../../components/inputs/Select";
import TableAPI from "../../components/elements/TableAPI";

import useSearch from "../../hooks/useSearch";

const RequestLookup = () => {
    const [headers] = useState([
        { columnMap: "name", label: "Name", type: String },
        { columnMap: "status", label: "Status", type: String },
        { columnMap: "type", label: "Type", type: String },
        { columnMap: "received", label: "Received", type: String },
        { columnMap: "schedule_date", label: "Schedule Date", type: String },
        { columnMap: "activity", label: "Activity", type: String },
        { columnMap: "report", label: "Report", type: String },
    ]);

    const [statusOptions] = useState([
        { id: "", title: "", val: "" },
        { id: "received", title: "Received", val: "received" },
        { id: "assigned", title: "Assigned", val: "assigned" },
        { id: "scheduled", title: "Scheduled", val: "scheduled" },
        { id: "assessed", title: "Assessed", val: "assessed" },
        { id: "submitted", title: "Submitted", val: "submitted" },
        { id: "completed", title: "Completed", val: "completed" },
        { id: "on_hold", title: "On_hold", val: "on_hold" },
        { id: "cancelled", title: "Cancelled", val: "cancelled" },
        { id: "reopened", title: "Reopened", val: "reopened" },
    ]);

    const [dateRangeOptions] = useState([
        { id: "7", title: "Last 7 Days", val: "7" },
        { id: "30", title: "Last 30 Days", val: "30" },
        { id: "90", title: "Last 90 Days", val: "90" },
    ]);

    const [searchStatus, setSearchStatus] = useState(false);

    useEffect(() => {
        setSearchStatus(false);
    }, []);

    const redoSearch = async (params = searchObj) => {
        try {
            // need to implement api here

            setSearchStatus(true);
        } catch (e) {
            console.log(e);
        }
    };

    const handleTableChange = (props) => {
        updateSearchObj(props);
        redoSearch({ ...searchObj, ...props });
    };

    const [{ searchObj }, { formUpdateSearchObj, updateSearchObj }] = useSearch(
        {
            searchObj: {
                sortColumn: headers[0].columnMap,
                sortDirection: "asc",
            },
        }
    );

    return (
        <PageLayout>
            <div className="content-box">
                <h1 className="box-title mb-3">Request Lookup</h1>

                <div className="form-row">
                    <div className="col-md-12">
                        <div className="white-box white-box-small">
                            <div className="row m-0">
                                <div className="col-md-3">
                                    <Select
                                        name="status"
                                        label="Status"
                                        options={statusOptions}
                                    />
                                </div>

                                <div className="col-md-3">
                                    <InputText
                                        name="from_date"
                                        label="From Date"
                                        type="date"
                                    />
                                </div>

                                <div className="col-md-3">
                                    <InputText
                                        name="to_date"
                                        label="To Date"
                                        type="date"
                                    />
                                </div>

                                <div className="col-md-3">
                                    <Select
                                        name="date_range"
                                        label="Date Range"
                                        options={dateRangeOptions}
                                    />
                                </div>

                                <div className="col-md-3">
                                    <InputText
                                        name="member_id"
                                        label="Member ID"
                                    />
                                </div>

                                <div className="col-md-3">
                                    <InputText
                                        name="auth_number"
                                        label="Auth#"
                                    />
                                </div>

                                <div className="col-md-3 align-self-end">
                                    <Button className="btn btn-block btn-primary mb-md-3 py-2">
                                        Search{" "}
                                        <span className="d-inline-block d-md-none d-lg-none d-xl-inline-block">
                                            Requests
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="box-outside-title">Your Requests</div>

                        <div className="white-box white-box-small">
                            <div className="row">
                                <div className="col-md-12">
                                    {!searchStatus && ( // need to add no data status
                                        <div className="no-result">
                                            Do the search
                                        </div>
                                    )}
                                    {searchStatus && ( // need to use real data here
                                        <TableAPI
                                            searchObj={searchObj}
                                            headers={headers}
                                            data={[]}
                                            dataMeta={{
                                                current_page: 1,
                                                from: null,
                                                last_page: 1,
                                                links: [],
                                                path: "",
                                                per_page: 50,
                                                to: null,
                                                total: 0,
                                            }}
                                            onChange={handleTableChange}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default RequestLookup;

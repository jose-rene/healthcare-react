import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useUser } from "Context/UserContext";
import PageLayout from "../../layouts/PageLayout";
import InputText from "../../components/inputs/InputText";
import Button from "../../components/inputs/Button";
import Select from "../../components/inputs/Select";
import TableAPI from "../../components/elements/TableAPI";
import useSearch from "../../hooks/useSearch";
import useApiCall from "../../hooks/useApiCall";
import Form from "../../components/elements/Form";
import Icon from "../../components/elements/Icon";
import { ACTIONS } from "../../helpers/table";

const RequestLookup = () => {
    const { getUser, setSearch } = useUser();
    const {
        search: {
            auth_number,
            date_range,
            from_date,
            to_date,
            request_status_id,
            member_id,
        },
    } = getUser();

    const [
        {
            loading,
            data: { data = [], meta = {} },
        },
        fireDoSearch,
    ] = useApiCall({
        url: "/request",
    });

    const [statusOptions] = useState([
        { id: "all", value: "0", title: "All" },
        { id: "received", value: "1", title: "Received" },
        { id: "assigned", value: "2", title: "Assigned" },
        { id: "scheduled", value: "3", title: "Scheduled" },
        { id: "assessed", value: "4", title: "Assessed" },
        { id: "submitted", value: "5", title: "Submitted" },
        { id: "completed", value: "6", title: "Completed" },
        { id: "on_hold", value: "7", title: "On Hold" },
        { id: "cancelled", value: "8", title: "Cancelled" },
        { id: "reopened", value: "9", title: "Reopened" },
    ]);

    const [headers] = useState([
        { columnMap: "member.name", label: "Name", type: String },
        { columnMap: "auth_number", label: "Auth ID", type: String },
        {
            columnMap: "request_status_id",
            formatter: (request_status_id) => {
                const found = statusOptions.find(
                    ({ value }) => value === request_status_id
                );

                return found?.title || "";
            },
            label: "Status",
            type: String,
        },
        {
            columnMap: "request_items.0.name",
            label: "Type",
            type: String,
        },
        {
            columnMap: "created_at",
            label: "Received",
            type: Date,
            // formatter: date => moment(date).format('mm/dd/YYYY')
        },
        { columnMap: "due_at", label: "Schedule Date", type: String },

        // TODO :: DEV :: NOTE :: this will basically show the last status change
        { columnMap: "activities.0.message", label: "Activity", type: String },
        {
            label: "Actions",
            columnMap: "member.id",
            type: ACTIONS,
            disableSortBy: true,
            // need to update reports url if it is existed or not
            formatter(member_id, { id: request_id }) {
                return (
                    <>
                        <Link
                            className="pr-2"
                            to={`/member/${member_id}/request/add`}
                        >
                            <Icon size="1x" icon="plus" />
                        </Link>
                        <Link
                            className="px-2"
                            to={`/member/${member_id}/request/${request_id}/edit`}
                        >
                            <Icon size="1x" icon="edit" />
                        </Link>
                        <Link className="pl-2" to="#">
                            <Icon size="1x" icon="flag" />
                        </Link>
                    </>
                );
            },
        },
    ]);

    const [dateRangeOptions] = useState([
        { id: "", title: "", val: "" },
        { id: "7", title: "Last 7 Days", val: "7" },
        { id: "30", title: "Last 30 Days", val: "30" },
        { id: "90", title: "Last 90 Days", val: "90" },
    ]);

    const [{ fromDate, toDate }, setDateRange] = useState({
        fromDate: from_date,
        toDate: to_date,
    });

    const [searchStatus, setSearchStatus] = useState(false);

    useEffect(() => {
        setSearchStatus(false);
    }, []);

    const redoSearch = async (params = searchObj) => {
        try {
            // need to implement api here
            setSearch(params);
            setSearchStatus(true);
            await fireDoSearch({ params });
        } catch (e) {
            console.log(e);
        }
    };

    const handleTableChange = (props) => {
        updateSearchObj(props);
        redoSearch({ ...searchObj, ...props });
    };

    const handleFormSubmit = (e) => redoSearch();

    const [{ searchObj }, { formUpdateSearchObj, updateSearchObj }] = useSearch(
        {
            searchObj: {
                sortColumn: headers[0].columnMap,
                sortDirection: "asc",
            },
        }
    );

    const updateDateRange = ({ target: { value } }) => {
        const toValue = value ? moment().format("YYYY-MM-DD") : "";
        const fromValue = value
            ? moment().subtract(value, "days").format("YYYY-MM-DD")
            : "";
        setDateRange((prevRange) => {
            return {
                ...prevRange,
                fromDate: fromValue,
                toDate: toValue,
            };
        });
        updateSearchObj({
            from_date: fromValue,
            to_date: toValue,
            date_range: value,
        });
    };

    return (
        <PageLayout>
            <div className="content-box">
                <h1 className="box-title mb-3">Request Lookup</h1>

                <div className="form-row">
                    <div className="col-md-12">
                        <Form onSubmit={handleFormSubmit}>
                            <div className="white-box white-box-small">
                                <div className="row m-0">
                                    <div className="col-md-3">
                                        <Select
                                            name="request_status_id"
                                            label="Status"
                                            defaultValue={request_status_id}
                                            options={statusOptions}
                                            onChange={formUpdateSearchObj}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <InputText
                                            name="from_date"
                                            label="From Date"
                                            defaultValue={fromDate}
                                            type="date"
                                            onChange={formUpdateSearchObj}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <InputText
                                            name="to_date"
                                            label="To Date"
                                            defaultValue={toDate}
                                            type="date"
                                            onChange={formUpdateSearchObj}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <Select
                                            name="date_range"
                                            label="Date Range"
                                            defaultValue={date_range}
                                            options={dateRangeOptions}
                                            onChange={updateDateRange}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <InputText
                                            name="member_id"
                                            label="Member ID"
                                            defaultValue={member_id}
                                            onChange={formUpdateSearchObj}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <InputText
                                            name="auth_number"
                                            defaultValue={auth_number}
                                            label="Auth #"
                                            onChange={formUpdateSearchObj}
                                        />
                                    </div>

                                    <div className="col-md-3 align-self-end">
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="btn btn-block btn-primary mb-md-3 py-2"
                                        >
                                            Search Requests
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Form>
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
                                            loading={loading}
                                            data={data}
                                            dataMeta={meta}
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

import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import moment from "moment";

import { Button } from "components";
import FapIcon from "components/elements/FapIcon";
import ContextSelect from "components/contextInputs/Select";
import TableAPI from "components/elements/TableAPI";

import useApiCall from "hooks/useApiCall";
import useSearch from "hooks/useSearch";

import { ACTIONS } from "helpers/table";

const RequestsTable = () => {
    const history = useHistory();

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
        { columnMap: "auth_number", label: "Auth #", type: String },
        {
            columnMap: "request_status_id",
            formatter: (request_status_id) => {
                const found = statusOptions.find(
                    ({ value }) => Number(value) === Number(request_status_id)
                );
                // null status id maps to 0 string and inicates in progress
                // eslint-disable-next-line no-nested-ternary
                return found
                    ? found.value === "0"
                        ? "In Progress"
                        : found.title
                    : "";
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
            formatter: (date) =>
                date ? moment(date).format("MM/DD/YYYY") : "-",
        },
        {
            columnMap: "due_at",
            label: "Schedule Date",
            type: Date,
            formatter: (date) =>
                date ? moment(date).format("MM/DD/YYYY") : "-",
        },
        {
            columnMap: "activities.0.message",
            label: "Activity",
            type: String,
            disableSortBy: true,
        },
        {
            label: "Actions",
            columnMap: "member.id",
            type: ACTIONS,
            disableSortBy: true,
            formatter(member_id, { id: request_id }) {
                return (
                    <>
                        <Link className="px-2" to="#">
                            <FapIcon icon="file" size="1x" title="Report" />
                        </Link>
                        <Link className="pl-2" to="#">
                            <FapIcon icon="eye" size="1x" title="View" />
                        </Link>
                    </>
                );
            },
        },
    ]);

    const [{ searchObj }, { formUpdateSearchObj, updateSearchObj }] = useSearch(
        {
            searchObj: {
                sortColumn: headers[0].columnMap,
                sortDirection: "asc",
                perPage: 10,
            },
        }
    );

    const redoSearch = async (params = searchObj) => {
        try {
            await fireDoSearch({ params });
        } catch (e) {
            console.log(e);
        }
    };

    const handleTableChange = (props) => {
        updateSearchObj(props);
        redoSearch({ ...searchObj, ...props });
    };

    const handleNewRequest = () => {
        history.push("/healthplan/start-request");
    };

    useEffect(() => {
        redoSearch(searchObj);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchObj]);

    return (
        <>
            <Row>
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <h3>Requests for you</h3>

                        <div className="d-flex mt-3">
                            <ContextSelect
                                label="Status"
                                name="request_status_id"
                                options={statusOptions}
                                onChange={formUpdateSearchObj}
                            />
                            <Button
                                variant="primary"
                                className="mb-3 mx-3"
                                onClick={() => handleNewRequest()}
                            >
                                Create New Request
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TableAPI
                        searchObj={searchObj}
                        headers={headers}
                        loading={loading}
                        data={data}
                        dataMeta={meta}
                        onChange={handleTableChange}
                    />
                </Col>
            </Row>
        </>
    );
};

export default RequestsTable;
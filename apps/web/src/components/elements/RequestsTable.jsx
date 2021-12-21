import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Col, Row, ButtonGroup, ToggleButton } from "react-bootstrap";

import { useUser } from "Context/UserContext";

import { Button } from "components";
import FapIcon from "components/elements/FapIcon";
import ContextSelect from "components/contextInputs/Select";
import TableAPI from "components/elements/TableAPI";

import useApiCall from "hooks/useApiCall";
import useSearch from "hooks/useSearch";

import { ACTIONS } from "helpers/table";
import { fromUtc, formatDate } from "helpers/datetime";

const RequestsTable = () => {
    const history = useHistory();

    const { getUser, userCan, userIs } = useUser();
    const { primaryRole, timeZoneName } = getUser();

    const isClinician = userIs(["clinical_reviewer", "field_clinician"]);
    const isHpUsers = userIs([
        "hp_champion",
        "hp_finance",
        "hp_manager",
        "hp_user",
    ]);

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
        { id: "all", value: 0, title: "All" },
        { id: "received", value: 1, title: "Received" },
        { id: "assigned", value: 2, title: "Assigned" },
        { id: "scheduled", value: 3, title: "Scheduled" },
        { id: "assessed", value: 4, title: "Assessed" },
        { id: "submitted", value: 5, title: "Submitted" },
        { id: "completed", value: 6, title: "Completed" },
        { id: "on_hold", value: 7, title: "On Hold" },
        { id: "cancelled", value: 8, title: "Cancelled" },
        { id: "reopened", value: 9, title: "Reopened" },
    ]);

    const [filterOptions] = useState([
        { name: "All", value: "0" },
        { name: "My Stuff", value: "1" },
    ]);

    const [headers] = useState([
        { columnMap: "member.name", label: "Name", type: String },
        { columnMap: "auth_number", label: "Auth #", type: String },
        userCan("assign-clinicians") && {
            columnMap: "payer.company_name",
            label: "Payer",
            type: String,
        },
        {
            columnMap: "request_status_id",
            formatter: (request_status_id) => {
                const found = statusOptions.find(
                    ({ value }) => value === request_status_id
                );

                const color =
                    found?.id === "assigned" ? "in_progress" : found?.id;

                return (
                    <span className={`text-${color || "in_progress"}`}>
                        {found?.title || "Partially Entered"}
                    </span>
                );
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
            formatter: (date) => (date ? formatDate(date) : "-"),
        },
        {
            columnMap: "due_at",
            label: "Due Date",
            type: Date,
            formatter: (date) => (date ? fromUtc(date, timeZoneName) : "-"),
        },
        {
            columnMap: "activities.0.message",
            label: "Activity",
            type: String,
            disableSortBy: true,
        },
        !isClinician && {
            label: "Actions",
            columnMap: "member.id",
            type: ACTIONS,
            disableSortBy: true,
            formatter(member_id, { id: request_id, request_status_id }) {
                return (
                    <>
                        <Link
                            className="px-2"
                            to={
                                // eslint-disable-next-line no-nested-ternary
                                !request_status_id
                                    ? `/member/${member_id}/request/${request_id}/edit`
                                    : `/requests/${request_id}`
                            }
                        >
                            <FapIcon
                                size="1x"
                                icon={!request_status_id ? `edit` : `eye`}
                                title={!request_status_id ? `Edit` : `View`}
                            />
                        </Link>
                        <Link className="px-2" to="#">
                            <FapIcon icon="file" size="1x" title="Report" />
                        </Link>
                    </>
                );
            },
        },
    ]);

    const [{ searchObj }, { formUpdateSearchObj, updateSearchObj }] = useSearch(
        {
            searchObj: {
                sortColumn: headers[4].columnMap, // set 'received' as default
                sortDirection: "asc",
                perPage: 10,
                filter: "0",
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

    const handleRow = (row) => {
        if (!isClinician) return;

        history.push(`/assessment/${row.id}`);
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
                            <ButtonGroup className="mx-3">
                                {isHpUsers &&
                                    filterOptions.map((filter, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            id={`filter-${idx}`}
                                            type="radio"
                                            className={`mb-3 d-flex align-items-center shadow-none ${
                                                searchObj.filter !==
                                                filter.value
                                                    ? "bg-white"
                                                    : ""
                                            }`}
                                            variant="secondary"
                                            name="filter"
                                            value={filter.value}
                                            checked={
                                                searchObj.filter ===
                                                filter.value
                                            }
                                            onChange={formUpdateSearchObj}
                                        >
                                            {filter.name}
                                        </ToggleButton>
                                    ))}
                            </ButtonGroup>
                            <ContextSelect
                                label="Status"
                                name="request_status_id"
                                options={statusOptions}
                                onChange={formUpdateSearchObj}
                            />
                            {primaryRole !== "clinical_reviewer" &&
                                primaryRole !== "field_clinician" && (
                                    <Button
                                        variant="primary"
                                        className="mb-3 mx-3"
                                        onClick={() => handleNewRequest()}
                                    >
                                        Create New Request
                                    </Button>
                                )}
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
                        onClickRow={handleRow}
                    />
                </Col>
            </Row>
        </>
    );
};

export default RequestsTable;

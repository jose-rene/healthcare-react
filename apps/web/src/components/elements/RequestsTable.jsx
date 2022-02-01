import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Col, Row, ButtonGroup, ToggleButton } from "react-bootstrap";

import { useUser } from "Context/UserContext";

import { Button } from "components";
import Form from "components/elements/Form";
import FapIcon from "components/elements/FapIcon";
import ContextSelect from "components/contextInputs/Select";
import TableAPI from "components/elements/TableAPI";
import ContextInput from "components/inputs/ContextInput";
import DateRangeForm from "components/elements/DateRangeForm";

import useApiCall from "hooks/useApiCall";
import useSearch from "hooks/useSearch";

import { ACTIONS } from "helpers/table";
import { fromUtc, formatDate } from "helpers/datetime";

const RequestsTable = () => {
    const history = useHistory();

    const { getUser, userCan, userIs } = useUser();
    const { timeZoneName, search_prefs } = getUser();

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

    const [
        {
            loading: activityLoading,
            data: { data: activityData = [], meta: activityMeta = {} },
        },
        doGetActivity,
    ] = useApiCall({
        url: "/activity",
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

    const [tabOptions] = useState([
        { name: "Requests for you", value: 0 },
        { name: "Activities", value: 1 },
    ]);

    const [userOptions] = useState([
        { name: "Reviewer", value: "0" },
        { name: "Clinician", value: "1" },
    ]);

    const [selectedTab, setSelectedTab] = useState(0);

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
        !isClinician &&
            !userIs("reviewer_manager") && {
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

    const [activityHeaders] = useState([
        { columnMap: "message", label: "Message", type: String },
        {
            columnMap: "datetime",
            label: "Date",
            type: Date,
            formatter: (date) => (date ? fromUtc(date, timeZoneName) : "-"),
        },
    ]);

    const [{ searchObj }, { formUpdateSearchObj, updateSearchObj }] = useSearch(
        {
            searchObj: {
                ...{
                    sortColumn: "created_at",
                    sortDirection: "desc",
                    perPage: 10,
                    filter: "0",
                    is_clinician: "0",
                    lookup: "",
                },
                ...(search_prefs ?? {}),
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
        if (!isClinician && !userIs("reviewer_manager")) return;

        history.push(`/assessment/${row.id}`);
    };

    const handleTab = (tab) => {
        setSelectedTab(tab);
    };

    const handleOptions = ({ target: { name, value } }) => {
        updateSearchObj({ [name]: value });
        redoSearch({ ...searchObj, [name]: value });
    };

    useEffect(() => {
        redoSearch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedTab === 1) {
            doGetActivity();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTab]);

    return (
        <>
            <Row>
                <Col>
                    <Form
                        autocomplete={false}
                        defaultData={searchObj}
                        onSubmit={redoSearch}
                    >
                        <div className="d-flex justify-content-between align-items-center">
                            {!userIs("client_services_specialist") ? (
                                <h3>{tabOptions[selectedTab].name}</h3>
                            ) : (
                                <div className="d-flex my-3">
                                    <ButtonGroup>
                                        {tabOptions.map((tab, idx) => (
                                            <ToggleButton
                                                key={idx}
                                                id={`tab-${idx}`}
                                                type="radio"
                                                className={`py-3 d-flex align-items-center shadow-none ${
                                                    selectedTab !== tab.value
                                                        ? "bg-white"
                                                        : ""
                                                }`}
                                                variant="secondary"
                                                name="filter"
                                                value={tab.value}
                                                checked={
                                                    selectedTab === tab.value
                                                }
                                                onChange={() =>
                                                    handleTab(tab.value)
                                                }
                                            >
                                                {tab.name}
                                            </ToggleButton>
                                        ))}
                                    </ButtonGroup>
                                </div>
                            )}

                            <div className="d-flex mt-3">
                                <ButtonGroup className="mx-3">
                                    {(isHpUsers ||
                                        userIs("reviewer_manager")) &&
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
                                                onChange={handleOptions}
                                            >
                                                {filter.name}
                                            </ToggleButton>
                                        ))}
                                </ButtonGroup>
                                <ButtonGroup className="mx-3">
                                    {userIs([
                                        "clinical_reviewer",
                                        "reviewer_manager",
                                    ]) &&
                                        userOptions.map((user, idx) => (
                                            <ToggleButton
                                                key={idx}
                                                id={`user-${idx}`}
                                                type="radio"
                                                className={`mb-3 d-flex align-items-center shadow-none ${
                                                    searchObj.is_clinician !==
                                                    user.value
                                                        ? "bg-white"
                                                        : ""
                                                } ${
                                                    userIs([
                                                        "clinical_reviewer",
                                                        "reviewer_manager",
                                                    ])
                                                        ? "p-3"
                                                        : ""
                                                }`}
                                                variant="secondary"
                                                name="is_clinician"
                                                value={user.value}
                                                checked={
                                                    searchObj.is_clinician ===
                                                    user.value
                                                }
                                                onChange={handleOptions}
                                            >
                                                {user.name}
                                            </ToggleButton>
                                        ))}
                                </ButtonGroup>

                                {!isClinician && !userIs("reviewer_manager") && (
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

                        {selectedTab === 0 && (
                            <Row
                                className={
                                    userIs("field_clinician") ? "mt-3" : ""
                                }
                            >
                                <Col md={3}>
                                    <ContextSelect
                                        label="Status"
                                        name="request_status_id"
                                        options={statusOptions}
                                        onChange={formUpdateSearchObj}
                                    />
                                </Col>

                                <DateRangeForm
                                    searchObj={searchObj}
                                    setSearchObj={updateSearchObj}
                                />

                                <Col md={3}>
                                    <ContextInput
                                        name="lookup"
                                        label="Auth # or Last Name"
                                    />
                                </Col>

                                <Col md={3}>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100"
                                    >
                                        Search
                                    </Button>
                                </Col>
                            </Row>
                        )}
                    </Form>
                </Col>
            </Row>

            <Row>
                <Col>
                    {selectedTab === 0 && (
                        <TableAPI
                            searchObj={searchObj}
                            headers={headers}
                            loading={loading}
                            data={data}
                            dataMeta={meta}
                            onChange={handleTableChange}
                            onClickRow={handleRow}
                        />
                    )}
                    {selectedTab === 1 && (
                        <TableAPI
                            searchObj={{}}
                            headers={activityHeaders}
                            loading={activityLoading}
                            data={activityData}
                            dataMeta={activityMeta}
                            onChange={() => {}}
                        />
                    )}
                </Col>
            </Row>
        </>
    );
};

export default RequestsTable;

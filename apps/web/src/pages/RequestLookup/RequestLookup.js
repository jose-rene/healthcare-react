import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";

import PageLayout from "layouts/PageLayout";

import { useUser } from "Context/UserContext";

import { Button } from "components";
import Form from "components/elements/Form";
import ContextInput from "components/inputs/ContextInput";
import TableAPI from "components/elements/TableAPI";
import DateRangeForm from "components/elements/DateRangeForm";
import ContextSelect from "components/contextInputs/Select";
import PageTitle from "components/PageTitle";
import FapIcon from "components/elements/FapIcon";

import useApiCall from "hooks/useApiCall";

import { ACTIONS } from "helpers/table";
import dayjs from "dayjs";

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

    const [headers] = useState([
        { columnMap: "member.name", label: "Name", type: String },
        { columnMap: "auth_number", label: "Auth ID", type: String },
        {
            columnMap: "request_status_id",
            formatter: (request_status_id) => {
                const found = statusOptions.find(
                    ({ value }) => value === request_status_id
                );

                return found?.title || "In Progress";
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
                date ? dayjs(date).format("MM/DD/YYYY") : "-",
        },
        {
            columnMap: "due_at",
            label: "Schedule Date",
            type: String,
            formatter: (date) =>
                date ? dayjs(date).format("MM/DD/YYYY") : "-",
        },

        // TODO :: DEV :: NOTE :: this will basically show the last status change
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
            // need to update reports url if it is existed or not
            formatter(member_id, { id: request_id, request_status_id }) {
                return (
                    <>
                        <Link
                            className="pr-2"
                            to={`/member/${member_id}/request/add`}
                        >
                            <FapIcon size="1x" icon="plus" />
                        </Link>
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
                            />
                        </Link>
                        <Link className="pl-2" to="#">
                            <FapIcon size="1x" icon="flag" />
                        </Link>
                    </>
                );
            },
        },
    ]);

    const [searchStatus, setSearchStatus] = useState(false);
    const [searchObj, setSearchObj] = useState({
        sortColumn: headers[0].columnMap,
        sortDirection: "asc",
    });

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
        setSearchObj({ ...searchObj, ...props });
        redoSearch({ ...searchObj, ...props });
    };

    const onSubmit = async (formData) => {
        await redoSearch(formData);
    };

    return (
        <PageLayout>
            <Container fluid>
                <PageTitle title="Request Lookup" hideBack />

                <Row>
                    <Col md={12}>
                        <Form
                            autocomplete={false}
                            defaultData={{
                                auth_number,
                                date_range,
                                from_date,
                                to_date,
                                request_status_id,
                                member_id,
                            }}
                            onSubmit={onSubmit}
                        >
                            <Row>
                                <Col md={3}>
                                    <ContextSelect
                                        name="request_status_id"
                                        label="Status"
                                        options={statusOptions}
                                    />
                                </Col>

                                <DateRangeForm
                                    searchObj={searchObj}
                                    setSearchObj={setSearchObj}
                                />

                                <Col md={3}>
                                    <ContextInput
                                        name="member_id"
                                        label="Member ID"
                                    />
                                </Col>

                                <Col md={3}>
                                    <ContextInput
                                        name="auth_number"
                                        label="Auth #"
                                    />
                                </Col>

                                <Col md={3}>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={loading}
                                        block
                                    >
                                        Search Requests
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>

                    <Col md={12}>
                        <h5>Your Requests</h5>

                        <Row>
                            <Col md={12}>
                                {!searchStatus && ( // need to add no data status
                                    <div className="text-center py-2 bg-white">
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
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </PageLayout>
    );
};

export default RequestLookup;

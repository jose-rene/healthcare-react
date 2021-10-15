import React from "react";
import PageLayout from "../../layouts/PageLayout";
import TableAPI from "../../components/elements/TableAPI";
import useSearch from "../../hooks/useSearch";
import { ACTIONS } from "../../helpers/table";
import { Link } from "react-router-dom";
import useApiCall from "../../hooks/useApiCall";
import FapIcon from "../../components/elements/FapIcon";

const RequestSections = (props) => {
    const { params } = props.match;
    const { request_id } = params;

    const [
        {
            loading,
            data: { data = [], meta = {} },
        },
        fireDoSearch,
    ] = useApiCall({
        url: `/request/${request_id}/form`,
    });

    const headers = [
        {
            columnMap: "slug",
            label: "Slug",
            type: String,
        },
        {
            label: "Progress",
            columnMap: "is_started",
            formatter (is_started, { is_completed = false }) {
                if (!is_started && !is_completed) {
                    return <span className="text-danger">Not started</span>;
                }

                if (!is_completed) {
                    return <span className="text-warning">Started not done</span>;
                }

                return <span className="text-success">Completed</span>;
            },
        },
        {
            columnMap: "name",
            label: "Name",
            type: String,
        },
        {
            columnMap: "description",
            label: "Description",
            type: String,
        },
        {
            label: "Actions",
            columnMap: "slug",
            type: ACTIONS,
            disableSortBy: true,
            formatter: slug => (
                <Link className="px-2" to={`/requests/${request_id}/form-sections/${slug}`}>
                    <FapIcon icon="edit" size="1x" title="Do Form" />
                </Link>
            ),
        },
    ];

    const [{ searchObj }, { updateSearchObj }] = useSearch(
        {
            searchObj: {
                sortColumn: headers[0].columnMap,
                sortDirection: "asc",
                perPage: 10,
            },
            onSearch: fireDoSearch,
        },
    );

    return (
        <PageLayout>
            <h3 className="mb-3">Form sections for request id "{request_id}"</h3>

            <TableAPI
                searchObj={searchObj}
                headers={headers}
                loading={loading}
                data={data}
                dataMeta={meta}
                onChange={updateSearchObj}
            />
        </PageLayout>
    );
};

export default RequestSections;

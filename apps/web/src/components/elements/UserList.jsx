import React, { useEffect, useState } from "react";

import TableAPI from "./TableAPI";
import UserTopSearch from "./UserTopSearch";

import useSearch from "hooks/useSearch";
import useApiCall from "hooks/useApiCall";

import { ACTIONS } from "helpers/table";

import "styles/RequestList.scss";

const List = () => {
    const [headers] = useState([
        {
            label: "Title",
            columnMap: "primary_role_title", // name.title
            disableSortBy: true,
        },
        {
            label: "First Name",
            columnMap: "first_name",
        },
        {
            label: "Last Name",
            columnMap: "last_name",
        },
        {
            label: "Email",
            columnMap: "email",
        },
        {
            label: "Phone",
            columnMap: "phone_primary",
            disableSortBy: true,
        },
        {
            label: "Job Title",
            columnMap: "job_title",
            disableSortBy: true,
        },
        {
            label: "Actions",
            columnMap: "edit",
            disableSortBy: true,
            link: "/healthplan/user",
            type: ACTIONS,
        },
    ]);

    const [{ loading, data: { data = [], meta = {} } = {} }, fireCall] =
        useApiCall({
            url: "/user/search",
            defaultData: [],
            method: "post",
        });

    const [{ searchObj }, { updateSearchObj }] = useSearch({
        searchObj: {
            perPage: 10,
            sortColumn: headers[1].columnMap,
            sortDirection: "asc",
        },
    });

    const handleSearch = (_params = searchObj) => {
        const params = {
            ..._params,
            userSort: _params.sortColumn,
        };

        updateSearchObj({ ...searchObj, ...params });

        delete params.sortColumn;

        fireCall({ params });
    };

    useEffect(() => {
        handleSearch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTableChange = (params) => {
        // the table should update the search obj and fire the api call
        updateSearchObj({ ...searchObj, ...params });

        // this might feel redundant but the searchObj does not have the new
        // values from sorting and everything in time so this workaround helps
        // make sure everything is set correctly
        handleSearch({ ...searchObj, ...params });
    };

    return (
        <>
            <UserTopSearch handleSearch={handleSearch} searchObj={searchObj} />

            <TableAPI
                label="Users"
                searchObj={searchObj}
                headers={headers}
                data={data}
                loading={loading}
                dataMeta={meta}
                onChange={handleTableChange}
            />
        </>
    );
};

export default List;

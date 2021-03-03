import React, { useEffect, useMemo } from "react";
import useSearch from "../../hooks/useSearch";
import Icon from "./Icon";
import PageAlert from "./PageAlert";
import useApiCall from "../../hooks/useApiCall";
import "../../styles/RequestList.scss";
import TableTopSort from "./TableTopSort";
import TableAPI from "./TableAPI";

/* eslint-disable no-nested-ternary */

const List = () => {
    const headers = useMemo(() => [
        {
            label: "Title",
            columnMap: "roles.0.title", // name.title
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
            // disableSortBy: true,
        },
        {
            label: "City",
            columnMap: "address.city",
        },
    ], []);

    const [
        {
            loading,
            data: { data = [], meta = {} } = {},
            error,
        }, fireCall] = useApiCall({
        url: "/user/search",
        defaultData: [],
        method: "post",
    });

    const [{ searchObj }, { formUpdateSearchObj, updateSearchObj }] = useSearch(
        {
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

        delete params.sortColumn;

        fireCall({ params });
    };

    useEffect(() => {
        handleSearch();
    }, []);

    const handleTableChange = params => {
        // the table should update the search obj and fire the api call
        updateSearchObj(params);

        // this might feel redundant but the searchObj does not have the new
        // values from sorting and everything in time so this workaround helps
        // make sure everything is set correctly
        handleSearch({ ...searchObj, ...params });
    };

    return !loading ? (
        <>
            <TableTopSort
                handleSearch={handleSearch}
                updateSearchObj={formUpdateSearchObj}
            />
            <TableAPI
                label="Users"
                searchObj={searchObj}
                headers={headers}
                data={data}
                dataMeta={meta}
                onChange={handleTableChange}
            />
        </>
    ) : error ? (
        <PageAlert>{error.message ?? "No Users Found."}</PageAlert>
    ) : (
        <div className="text-center">
            <Icon icon="spinner" />
        </div>
    );
};

export default List;

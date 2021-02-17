import React, { useEffect, useMemo } from "react";
import Button from "../inputs/Button";
import Icon from "./Icon";
import PageAlert from "./PageAlert";
import useApiCall from "../../hooks/useApiCall";
import "../../styles/RequestList.scss";
import DataTable from "./DataTable";

/* eslint-disable no-nested-ternary */

const List = () => {
    const [{ loading, data, error }, fireCall] = useApiCall({
        url: "/user/search",
        method: "post",
    });

    useEffect(() => {
        fireCall({
            params: { hello: "world" },
        });
    }, []);

    const handleSearch = (e) => {
        fireCall({
            params: { hello: "world" },
        });
    };
    const columns = useMemo(
        () => [
            {
                Header: "Title",
                accessor: "name.title",
                disableSortBy: true,
            },
            {
                Header: "First Name",
                accessor: "name.first",
            },
            {
                Header: "Last Name",
                accessor: "name.last",
            },
            {
                Header: "Email",
                accessor: "email",
                disableSortBy: true,
            },
            {
                Header: "City",
                accessor: "location.city",
            },
        ],
        []
    );
    return !loading ? (
        <>
            <div className="d-none d-sm-block mb-3">
                <div className="d-flex justify-content-between">
                    <div className="flex-fill px-2">
                        <select className="app-input-filter margin-input">
                            <option>Therapist</option>
                        </select>
                    </div>

                    <div className="flex-fill px-2">
                        <select className="app-input-filter margin-input">
                            <option>Status</option>
                        </select>
                    </div>

                    <div className="flex-fill px-2">
                        <select className="app-input-filter margin-input">
                            <option>From Date</option>
                        </select>
                    </div>

                    <div className="flex-fill px-2">
                        <select className="app-input-filter margin-input">
                            <option>To Date</option>
                        </select>
                    </div>

                    <div className="flex-fill px-2">
                        <select className="app-input-filter margin-input">
                            <option>Date Range</option>
                        </select>
                    </div>

                    <div className="ml-auto px-2">
                        <Button className="pt-1 pb-1" onClick={handleSearch}>
                            Search
                        </Button>
                    </div>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={data.length ? data : []}
                entityName="Users"
                loading={loading}
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

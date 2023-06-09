import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import { get } from "lodash";

import TableHeaders from "./TableHeaders";
import TablePagination from "./TablePagination";
import FapIcon from "../FapIcon";
import Select from "../../inputs/Select";

import { mapTypeToClass } from "helpers/table";

const TableAPI = ({
    label = "Results",
    searchObj,
    headers = [],
    data = [],
    loading = true,
    loadingMessage = "Loading...",
    onChange,
    onClickRow = null,
    emptyMessage = "No Records Found.",
    dataMeta: {
        total: total_records = 1,
        last_page: lastPage = 1,
        from = 1,
        to = 1,
    },
}) => {
    const { perPage = 50 } = searchObj;

    const handlePagination = (value = 1) => {
        onChange({ page: value });
    };

    const handlePerPageChange = ({ target: { name, value } }) => {
        onChange({ [name]: value, page: 1 });
    };

    const totalPages = useMemo(() => {
        return Math.ceil(total_records / perPage);
    }, [total_records, perPage]);

    const renderBody = useMemo(() => {
        if (!data || data.length === 0) {
            return (
                <tr key="0">
                    <td colSpan={headers.length} className="text-center">
                        {emptyMessage}
                    </td>
                </tr>
            );
        }
        return data.map((d, index) => (
            <tr
                key={`tr-th-${index}`}
                role="button"
                onClick={onClickRow ? () => onClickRow(d) : () => {}}
            >
                {headers.map(
                    ({ columnMap, link, type, formatter = false }, indexTd) => {
                        let column = null;

                        if (columnMap === "edit") {
                            column = (
                                <Link to={`${link}/${d.id}`} title="Edit">
                                    <FapIcon size="1x" icon="edit" />
                                </Link>
                            );
                        } else if (formatter) {
                            column = formatter(get(d, columnMap, ""), d);
                        } else {
                            column = get(d, columnMap, "");
                        }

                        return (
                            columnMap && (
                                <td
                                    key={`tr-th-td-${indexTd}`}
                                    className={`${mapTypeToClass(type)}`}
                                >
                                    {column}
                                </td>
                            )
                        );
                    }
                )}
            </tr>
        ));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headers, data]);

    const paginationOptions = useMemo(() => {
        return [10, 20, 50, 100].map((n) => ({ id: n, title: n, val: n }));
    }, []);

    if (loading) {
        return <div>{loadingMessage}</div>;
    }

    return (
        <>
            <div className="row mb-3">
                <div className="col">
                    <small className="text-mute ms-0">
                        {total_records
                            ? `Showing ${from} to ${to} of ${total_records} ${label}`
                            : emptyMessage}
                    </small>
                </div>
            </div>
            <div className="clearfix" />
            <Table striped bordered hover responsive condensed="condensed">
                <TableHeaders
                    headers={headers}
                    searchObj={searchObj}
                    onChange={onChange}
                />
                <tbody>{renderBody}</tbody>
            </Table>
            <div className="d-flex">
                {totalPages > 1 && (
                    <>
                        <Select
                            label="Show"
                            inlineLabel
                            name="perPage"
                            value={perPage}
                            onChange={handlePerPageChange}
                            options={paginationOptions}
                        />
                        <div className="ms-auto">
                            <TablePagination
                                lastPage={lastPage}
                                onChange={handlePagination}
                                searchObj={searchObj}
                                total_records={total_records}
                                totalPages={totalPages}
                            />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default TableAPI;

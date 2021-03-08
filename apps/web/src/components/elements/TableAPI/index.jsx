import React, { useMemo } from "react";
import { Table } from "react-bootstrap";
import { get } from "lodash";
import { Link } from "react-router-dom";
import { mapTypeToClass } from "../../../helpers/table";
import Select from "../../inputs/Select";
import TableHeaders from "./TableHeaders";
import TablePagination from "./TablePagination";
import Icon from "../Icon";

const TableAPI = ({
    label = "Results",
    searchObj,
    headers = [],
    data = [],
    onChange,
    emptyMessage = "Nothing to show",
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
        if (!data || data.length == 0) {
            return <div className="table-empty">{emptyMessage}</div>;
        }
        return data.map((d, index) => (
            <tr key={`tr-th-${index}`}>
                {headers.map(({ columnMap, link, type }, indexTd) => (
                    <td
                        key={`tr-th-td-${indexTd}`}
                        className={`${mapTypeToClass(type)}`}
                    >
                        {columnMap === "edit" ? (
                            <Link to={`${link}/${d.id}`} title="Edit">
                                <Icon icon="edit" size="lg" />
                            </Link>
                        ) : (
                            get(d, columnMap, "")
                        )}
                    </td>
                ))}
            </tr>
        ));
    }, [headers, data]);

    const paginationOptions = useMemo(() => {
        return [10, 20, 50, 100].map((n) => ({ id: n, title: n, val: n }));
    }, []);

    return (
        <>
            <div className="row mb-3">
                <div className="col">
                    <small className="text-mute ml-0">
                        Showing {from} to {to} of {total_records} {label}
                    </small>
                </div>
            </div>
            <div className="clearfix" />
            <Table striped bordered hover responsive condensed>
                <TableHeaders
                    headers={headers}
                    searchObj={searchObj}
                    onChange={onChange}
                />
                <tbody>{renderBody}</tbody>
            </Table>
            <div className="d-flex mt-3">
                {totalPages > 1 && (
                    <>
                        <TablePagination
                            lastPage={lastPage}
                            onChange={handlePagination}
                            searchObj={searchObj}
                            total_records={total_records}
                            totalPages={totalPages}
                        />
                        <div className="ml-auto">
                            <Select
                                label="Show"
                                inlineLabel
                                className="form-control"
                                name="perPage"
                                value={perPage}
                                onChange={handlePerPageChange}
                                options={paginationOptions}
                            />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default TableAPI;

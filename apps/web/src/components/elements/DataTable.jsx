/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-key */
import React, { useEffect } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import { Pagination, Table } from "react-bootstrap";
import Select from "../inputs/Select";
import Icon from "./Icon";

const DataTable = ({ columns, data, entityName, loading, searchObj ,updateSearchObj }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useSortBy,
        usePagination
    );
    const itemStart = pageIndex * pageSize + 1;
    const itemEnd = itemStart + pageSize - 1;
    const pageInfo = data.length
        ? `Showing ${itemStart} to ${itemEnd} of ${data.length} ${
            entityName ?? "items"
        } `
        : `No ${entityName} Found`;
    const pageButtons = [];
    for (let i = 0; i < pageCount; i++) {
        pageButtons.push(
            <Pagination.Item
                onClick={() => gotoPage(i)}
                disabled={i === pageIndex}
                key={i}
            >
                {i + 1}
            </Pagination.Item>
        );
    }

    const getRows = () => {
        const tblRows = [];
        if (data.length === 0) {
            return (
                <tr>
                    <td className="text-center" colSpan={columns.length}>
                        {`No ${entityName} Found`}
                    </td>
                </tr>
            );
        }
        if (loading) {
            return (
                <tr>
                    <td className="text-center" colSpan={columns.length}>
                        Loading...
                    </td>
                </tr>
            );
        }
        page.map((row) => {
            prepareRow(row);
            tblRows.push(
                <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                        return (
                            <td {...cell.getCellProps()}>
                                {cell.render("Cell")}
                            </td>
                        );
                    })}
                </tr>
            );
        });
        return tblRows;
    };

    useEffect(() => {
        updateSearchObj({target: {name: 'pageIndex', value: pageIndex}})
    }, [pageIndex]);

    useEffect(() => {
        updateSearchObj({target: {name: 'pageSize', value: pageSize}})
    }, [pageSize]);

    return (
        <>
            <div className="float-left text-muted">
                <small>{pageInfo}</small>
            </div>
            <Table striped bordered hover varient="dark" {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th
                                    {...column.getHeaderProps(
                                        column.getSortByToggleProps()
                                    )}
                                >
                                    {column.render("Header")}
                                    <span>
                                        {column.isSorted ? (
                                            column.isSortedDesc ? (
                                                <Icon
                                                    icon="arrow-down"
                                                    size="sm"
                                                    className="ml-2"
                                                />
                                            ) : (
                                                <Icon
                                                    icon="arrow-up"
                                                    size="sm"
                                                    className="ml-2"
                                                />
                                            )
                                        ) : (
                                            ""
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody {...getTableBodyProps()}>{getRows()}</tbody>
            </Table>
            <Pagination className="float-left">
                <Pagination.First
                    onClick={() => gotoPage(0)}
                    disabled={pageIndex === 0}
                />
                <Pagination.Prev
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                />
                {pageButtons}
                <Pagination.Next
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                />
                <Pagination.Last
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={pageCount - 1 === pageIndex}
                />
            </Pagination>
            <Select
                name="perPage"
                label="Show"
                wrapperClass="form-group float-right form-inline"
                labelClass="text-primary mr-2"
                options={[
                    { id: 10, val: 10, title: "10" },
                    { id: 25, val: 25, title: "25" },
                    { id: 50, val: 50, title: "50" },
                    { id: 100, val: 100, title: "100" },
                ]}
                onChange={(e) => {
                    setPageSize(Number(e.target.value));
                }}
            />
        </>
    );
};

export default DataTable;

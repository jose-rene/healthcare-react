import React from "react";
import { mapTypeToClass } from "../../../helpers/table";
import Icon from "../Icon";

const TableHeaders = ({
    headers = [],
    defaultSortColumn = "na",
    searchObj: { sortDirection = defaultSortColumn, sortColumn = "" },
    onChange,
}) => {
    const handleOnChange = async (columnMap) => {
        if (columnMap === sortColumn) {
            const direction = sortDirection !== "asc" ? "asc" : "desc";

            onChange({ sortDirection: direction, page: 1 });
        } else {
            await onChange({
                sortColumn: columnMap,
                sortDirection: "asc",
                page: 1,
            });
        }
    };

    const sortArrow = (columnMap) => {
        if (columnMap !== sortColumn) {
            return <Icon size="1x" icon="sort" />;
        }

        switch (sortDirection) {
            case "asc":
                return <Icon size="1x" icon="sort-up" />;
            case "desc":
                return <Icon size="1x" icon="sort-down" />;
            default:
                return <Icon size="1x" icon="sort" />;
        }
    };

    return (
        <thead>
            <tr>
                {headers.map((head, index) => {
                    const {
                        columnMap,
                        type,
                        label = columnMap,
                        disableSortBy = false,
                    } = head;

                    if (disableSortBy) {
                        return (
                            <th
                                key={`table-th-${index}`}
                                className={`${mapTypeToClass(type)}`}
                            >
                                {label}
                            </th>
                        );
                    }

                    return (
                        columnMap && (
                            <th
                                key={`table-th-${index}`}
                                className={`c-pointer ${mapTypeToClass(type)}`}
                                onClick={() => handleOnChange(columnMap)}
                            >
                                {label}{" "}
                                <span className="float-right ms-1">
                                    {sortArrow(columnMap)}
                                </span>
                            </th>
                        )
                    );
                })}
            </tr>
        </thead>
    );
};

export default TableHeaders;

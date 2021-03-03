import React, { useMemo } from "react";
import { Pagination } from "react-bootstrap";
import useWindowSize from "../../../hooks/useWindowSize";
import Select from "../../inputs/Select";
import { range } from "lodash";

const TablePagination = ({totalPages, onChange, lastPage, searchObj}) => {
    const {width} = useWindowSize();
    const {
        page = 1,
        perPage = 50,
    } = searchObj;

    const items = useMemo(() => {
        if(totalPages <= 1){
            return null
        }

        const active = page;
        const _items = [
            <Pagination.First
                key={`pagination-item-first`}
                active={active <= 1}
                onClick={() => onChange(1)}
            />,
            <Pagination.Prev
                key={`pagination-item-prev`}
                active={active == 1}
                onClick={() => onChange(active-1)}
            />
        ];

        for (let number = 1; number <= totalPages; number++) {
            _items.push(
                <Pagination.Item
                    key={`pagination-item-${number}`}
                    active={number === active}
                    onClick={() => onChange(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }

        _items.push(
            <Pagination.Next
                key={`pagination-item-next`}
                active={active == lastPage}
                onClick={() => onChange(active+1)}
            />
        );
        _items.push(
            <Pagination.Last
                key={`pagination-item-last`}
                active={active == lastPage}
                onClick={() => onChange(lastPage)}
            />
        )

        return _items;
    }, [page, perPage]);

    if (totalPages > 10 || width < 480) {
        return (
            <Select
                label="Page"
                inlineLabel
                name="page"
                value={page}
                options={range(1, lastPage).map(n => ({
                    id: n,
                    value: n,
                    title: n,
                }))}
                onChange={({target: {value}}) => onChange(value)}
            />
        );
    }

    return (
        <Pagination>
            {items}
        </Pagination>
    );
}

export default TablePagination;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import FapIcon from "components/elements/FapIcon";
import TableAPI from "components/elements/TableAPI";

import useApiCall from "hooks/useApiCall";
import useSearch from "hooks/useSearch";

import { ACTIONS } from "helpers/table";

const RequestForms = () => {
    const [
        {
            loading,
            data: { data = [], meta = {} },
        },
        fireDoSearch,
    ] = useApiCall({
        url: "/form_group",
    });

    const [headers] = useState([
        { columnMap: "name", label: "Name", type: String },

        {
            label: "Actions",
            columnMap: "slug",
            type: ACTIONS,
            disableSortBy: true,
            formatter (slug) {
                return (
                    <Link
                        className="px-2"
                        to={`/form-wizard/${slug}`}
                    >
                        <FapIcon size="1x" icon="eye" />
                    </Link>
                );
            },
        },
    ]);

    const [{ searchObj }, { formUpdateSearchObj, updateSearchObj }] = useSearch(
        {
            searchObj: {
                sortColumn: headers[0].columnMap,
                sortDirection: "asc",
                perPage: 10,
            },
        },
    );

    const redoSearch = async (params = searchObj) => {
        try {
            await fireDoSearch({ params });
        } catch (e) {
            console.log(e);
        }
    };

    const handleTableChange = (props) => {
        updateSearchObj(props);
        redoSearch({ ...searchObj, ...props });
    };

    useEffect(() => {
        redoSearch(searchObj);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchObj]);

    return (
        <>
            <Row>
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <h3>Forms</h3>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TableAPI
                        searchObj={searchObj}
                        headers={headers}
                        loading={loading}
                        data={data}
                        dataMeta={meta}
                        onChange={handleTableChange}
                    />
                </Col>
            </Row>
        </>
    );
};

export default RequestForms;

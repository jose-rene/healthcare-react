import React, { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";

import PageLayout from "layouts/PageLayout";

import PageTitle from "components/PageTitle";
import TableAPI from "components/elements/TableAPI";

import useApiCall from "hooks/useApiCall";
import useSearch from "hooks/useSearch";

import { ACTIONS } from "helpers/table";

const AssessmentRules = () => {
    const [
        {
            loading,
            data: { data = [], meta = {} },
        },
        fireDoSearch,
    ] = useApiCall({
        url: "admin/assessment-rules",
    });

    useEffect(() => {
        fireDoSearch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [headers] = useState([
        { columnMap: "name", label: "Name", type: String },
        {
            columnMap: "id",
            label: "Actions",
            type: ACTIONS,
            disableSortBy: true,
            formatter(id) {
                return <></>;
            },
        },
    ]);

    const handleTableChange = (props) => {
        updateSearchObj(props);
        redoSearch({ ...searchObj, ...props });
    };

    const [{ searchObj }, { updateSearchObj }] = useSearch({
        searchObj: {
            sortColumn: headers[0].columnMap,
            sortDirection: "asc",
        },
    });

    const redoSearch = async (params = searchObj) => {
        try {
            await fireDoSearch({ params });
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <PageLayout>
            <Container fluid>
                <Row>
                    <Col md={12}>
                        <PageTitle title="Assessment Rules" hideBack />
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
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
            </Container>
        </PageLayout>
    );
};

export default AssessmentRules;

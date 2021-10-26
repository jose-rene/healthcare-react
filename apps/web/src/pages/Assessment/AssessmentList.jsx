import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";

import PageLayout from "layouts/PageLayout";

import PageTitle from "components/PageTitle";
import TableAPI from "components/elements/TableAPI";
import FapIcon from "components/elements/FapIcon";

import useApiCall from "hooks/useApiCall";
import useSearch from "hooks/useSearch";

import { ACTIONS } from "helpers/table";

const AssessmentList = (props) => {
    const [
        {
            loading,
            data: { data = [], meta = {} },
        },
        fireDoSearch,
    ] = useApiCall({
        url: "admin/assessments",
    });

    const [headers] = useState([
        { columnMap: "name", label: "Name", type: String },
        {
            columnMap: "description",
            label: "Description",
            type: String,
            disableSortBy: true,
        },
        {
            columnMap: "id",
            label: "Actions",
            type: ACTIONS,
            disableSortBy: true,
            formatter(id) {
                return (
                    <>
                        <Link to={`/admin/assessment/${id}`}>
                            <FapIcon size="1x" icon="edit" />
                        </Link>
                    </>
                );
            },
        },
    ]);

    useEffect(() => {
        fireDoSearch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleNewAssessment = () => {
        props.history.push({
            pathname: "/admin/add-assessment",
        });
    };

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
                <PageTitle
                    title="Assessments"
                    actions={[
                        {
                            icon: "plus",
                            label: "Add",
                            onClick: handleNewAssessment,
                        },
                    ]}
                    hideBack
                />

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

export default AssessmentList;

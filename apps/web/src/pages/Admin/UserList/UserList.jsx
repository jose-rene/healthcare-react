import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";

import PageLayout from "layouts/PageLayout";

import { Button } from "components";
import Form from "components/elements/Form";
import TableAPI from "components/elements/TableAPI";
import PageTitle from "components/PageTitle";
import ContextInput from "components/inputs/ContextInput";
import ContextSelect from "components/contextInputs/Select";
import FapIcon from "components/elements/FapIcon";

import useApiCall from "hooks/useApiCall";
import useSearch from "hooks/useSearch";

import { ACTIONS } from "helpers/table";

const UserList = (props) => {
    const [
        {
            loading,
            data: { data = [], meta = {} },
        },
        fireDoSearch,
    ] = useApiCall({
        url: "admin/users",
    });

    const [headers] = useState([
        { columnMap: "name", label: "Name", type: String },
        { columnMap: "email", label: "Email", type: String },
        { columnMap: "phone_primary", label: "Phone", type: String },
        { columnMap: "primary_role_title", label: "Role", type: String },
        { columnMap: "user_type", label: "Type", type: String },
        {
            columnMap: "id",
            label: "Actions",
            type: ACTIONS,
            disableSortBy: true,
            formatter(id, { primary_role }) {
                const isEditable =
                    primary_role === "hp_user" ||
                    primary_role === "hp_finance" ||
                    primary_role === "hp_champion" ||
                    primary_role === "hp_manager" ||
                    primary_role === "chief_medical_officer" ||
                    primary_role === "clinical_national_director" ||
                    primary_role === "clinical_regional_director" ||
                    primary_role === "clinical_reviewer" ||
                    primary_role === "clinical_state_champion" ||
                    primary_role === "clinical_trainer" ||
                    primary_role === "field_clinician";

                return (
                    <>
                        {isEditable && (
                            <Link to={`/admin/users/${id}/edit`}>
                                <FapIcon size="1x" icon="edit" />
                            </Link>
                        )}
                    </>
                );
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

    const onSubmit = (formData) => {
        updateSearchObj(formData);
        redoSearch(formData);
    };

    useEffect(() => {
        fireDoSearch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleNewUser = () => {
        props.history.push({
            pathname: "/admin/users/add",
        });
    };

    return (
        <PageLayout>
            <Container fluid>
                <PageTitle
                    title="User List"
                    actions={[
                        {
                            icon: "plus",
                            label: "Add",
                            onClick: handleNewUser,
                        },
                    ]}
                    hideBack
                />

                <Row>
                    <Col md={12}>
                        <Form
                            autocomplete={false}
                            defaultData={searchObj}
                            onSubmit={onSubmit}
                        >
                            <Row>
                                <Col md={3}>
                                    <ContextInput
                                        name="search"
                                        label="Search"
                                    />
                                </Col>
                                <Col md={3}>
                                    <ContextSelect
                                        name="user_type"
                                        label="User Type"
                                        options={[
                                            {
                                                id: 0,
                                                title: "All",
                                                val: 0,
                                            },
                                            {
                                                id: 1,
                                                title: "Engineering",
                                                val: 1,
                                            },
                                            {
                                                id: 2,
                                                title: "Health Plan",
                                                val: 2,
                                            },
                                            {
                                                id: 3,
                                                title: "Clinical Services",
                                                val: 3,
                                            },
                                            {
                                                id: 4,
                                                title: "Business Operations",
                                                val: 4,
                                            },
                                        ]}
                                    />
                                </Col>
                                <Col md={3}>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        variant="primary"
                                        block
                                    >
                                        Search
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>

                    <Col md={12}>
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
                    </Col>
                </Row>
            </Container>
        </PageLayout>
    );
};

export default UserList;

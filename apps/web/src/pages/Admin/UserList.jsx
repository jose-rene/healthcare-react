import React, { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
// import MultiSelect from "react-select";

import PageLayout from "layouts/PageLayout";

import { Button } from "components";
import Form from "components/elements/Form";
import TableAPI from "components/elements/TableAPI";
import PageTitle from "components/PageTitle";
import ContextInput from "components/inputs/ContextInput";
import ContextSelect from "components/contextInputs/Select";

import useApiCall from "hooks/useApiCall";
import useSearch from "hooks/useSearch";

import { ACTIONS } from "helpers/table";

const UserList = () => {
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
            formatter(id, { roles, primary_role }) {
                return (
                    // <MultiSelect // Need to interact with the backend
                    //     closeMenuOnSelect={false}
                    //     value={primary_role}
                    //     isMulti
                    //     placeholder=""
                    //     options={rolesOptions(roles)}
                    //     onChange={() => console.log("on change?")}
                    // />
                    <></>
                );
            },
        },
    ]);

    // const rolesOptions = (roles) => {
    //     const arr = [];
    //     roles.forEach(({ name, title }) => {
    //         arr.push({ value: name, label: title });
    //     });

    //     return arr;
    // };

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

    return (
        <PageLayout>
            <Container fluid>
                <PageTitle title="User List" hideBack />

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

import React, { useState, useEffect } from "react";
import MultiSelect from "react-select";

import PageLayout from "../../layouts/PageLayout";

import TableAPI from "../../components/elements/TableAPI";
import Form from "../../components/elements/Form";
import InputText from "../../components/inputs/InputText";
import Button from "../../components/inputs/Button";
import Select from "../../components/inputs/Select";

import useApiCall from "../../hooks/useApiCall";
import useSearch from "../../hooks/useSearch";

import { ACTIONS } from "../../helpers/table";

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
                    <MultiSelect // Need to interact with the backend
                        closeMenuOnSelect={false}
                        value={primary_role}
                        isMulti
                        placeholder=""
                        options={rolesOptions(roles)}
                        onChange={() => console.log("on change?")}
                    />
                );
            },
        },
    ]);

    const rolesOptions = (roles) => {
        const arr = [];
        roles.forEach(({ name, title }) => {
            arr.push({ value: name, label: title });
        });

        return arr;
    };

    const handleFormSubmit = (e) => redoSearch();

    const handleTableChange = (props) => {
        updateSearchObj(props);
        redoSearch({ ...searchObj, ...props });
    };

    const [{ searchObj }, { formUpdateSearchObj, updateSearchObj }] = useSearch(
        {
            searchObj: {
                sortColumn: headers[0].columnMap,
                sortDirection: "asc",
            },
        }
    );

    const redoSearch = async (params = searchObj) => {
        try {
            await fireDoSearch({ params });
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fireDoSearch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <PageLayout>
            <div className="content-box">
                <h1 className="box-title">User List</h1>

                <div className="form-row">
                    <div className="col-md-12">
                        <Form onSubmit={handleFormSubmit}>
                            <div className="white-box white-box-small">
                                <div className="row m-0">
                                    <div className="col-md-3">
                                        <InputText
                                            name="search"
                                            label="Search"
                                            onChange={formUpdateSearchObj}
                                        />
                                    </div>
                                    <div>
                                        <Select
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
                                                    title:
                                                        "Business Operations",
                                                    val: 4,
                                                },
                                            ]}
                                        />
                                    </div>
                                    <div className="col-md-3 align-self-end">
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="btn btn-block btn-primary mb-md-3 py-2"
                                        >
                                            Search
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </div>

                    <div className="col-md-12">
                        <div className="white-box white-box-small">
                            <div className="row m-0">
                                <div className="col-md-12">
                                    <TableAPI
                                        searchObj={searchObj}
                                        headers={headers}
                                        loading={loading}
                                        data={data}
                                        dataMeta={meta}
                                        onChange={handleTableChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default UserList;

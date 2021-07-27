import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

import Select from "../../../components/inputs/Select";
import Button from "../../../components/inputs/Button";

import Icon from "../../../components/elements/Icon";
import TableAPI from "../../../components/elements/TableAPI";

import PageLayout from "../../../layouts/PageLayout";

import { ACTIONS } from "../../../helpers/table";

import useApiCall from "../../../hooks/useApiCall";
import useSearch from "../../../hooks/useSearch";

const Clinicians = (props) => {
    const [
        {
            data: { user_statuses = [], user_types = [] },
        },
        fireGetParams,
    ] = useApiCall({
        url: "admin/clinicaluser/params",
    });

    const [
        {
            loading,
            data: { data = [], meta = {} },
        },
        fireDoSearch,
    ] = useApiCall({
        url: "admin/clinicaluser/search",
    });

    useEffect(() => {
        fireGetParams();
        fireDoSearch();
        setSearchStatus(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [searchStatus, setSearchStatus] = useState(false);
    const [userStatusesOptions, setUserStatusesOptions] = useState([]);
    const [userTypesOptions, setUserTypesOptions] = useState([]);

    const [headers] = useState([
        { columnMap: "name", label: "Name", type: String },
        { columnMap: "clinical_user_type.name", label: "Type", type: String },
        {
            columnMap: "clinical_user_status.name",
            label: "Status",
            type: String,
        },
        { columnMap: "note", label: "Notes", type: String },
        {
            columnMap: "id",
            label: "Actions",
            type: ACTIONS,
            disableSortBy: true,
            formatter(id) {
                return (
                    <>
                        <Link to={`/admin/clinicians/${id}/edit`}>
                            <Icon
                                size="1x"
                                icon="edit"
                                className="mr-2 bg-secondary text-white rounded-circle p-1"
                            />
                        </Link>

                        <Icon
                            size="1x"
                            icon="info-circle"
                            className="mr-2 bg-secondary text-white rounded-circle p-1"
                        />
                    </>
                );
            },
        },
    ]);

    const { handleSubmit, register } = useForm();

    useEffect(() => {
        if (!user_statuses) {
            return;
        }

        const statusesArr = [{ id: "", title: "", val: "" }];
        user_statuses.forEach(({ id, name }) => {
            statusesArr.push({
                id,
                title: name,
                val: id,
            });
        });

        setUserStatusesOptions(statusesArr);
    }, [user_statuses]);

    useEffect(() => {
        if (!user_types) {
            return;
        }

        const typesArr = [{ id: "", title: "", val: "" }];
        user_types.forEach(({ id, name }) => {
            typesArr.push({
                id,
                title: name,
                val: id,
            });
        });

        setUserTypesOptions(typesArr);
    }, [user_types]);

    const onSubmit = (formData) => {
        redoSearch(formData);
    };

    const redoSearch = async (params = searchObj) => {
        try {
            setSearchStatus(true);
            await fireDoSearch({ params });
        } catch (e) {
            console.log(e);
        }
    };

    const [{ searchObj }, { formUpdateSearchObj, updateSearchObj }] = useSearch(
        {
            searchObj: {
                sortColumn: headers[0].columnMap,
                sortDirection: "asc",
            },
        }
    );

    const handleTableChange = (props) => {
        updateSearchObj(props);
        redoSearch({ ...searchObj, ...props });
    };

    const handleNewClinician = () => {
        props.history.push({
            pathname: "/admin/add-clinicians",
        });
    };

    return (
        <PageLayout>
            <div className="content-box">
                <div className="d-flex">
                    <h1 className="box-title mb-3 mr-4">Clinicians</h1>
                    <Button
                        icon="plus"
                        iconSize="sm"
                        className="btn btn-sm mb-3"
                        label="Add"
                        onClick={() => handleNewClinician()}
                    />
                </div>

                <div className="form-row">
                    <div className="col-md-12">
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <div className="white-box white-box-small">
                                <div className="row m-0">
                                    <div className="col-md-3">
                                        <Select
                                            name="type_id"
                                            label="Type"
                                            options={userTypesOptions}
                                            ref={register({})}
                                            onChange={formUpdateSearchObj}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <Select
                                            name="status_id"
                                            label="Status"
                                            options={userStatusesOptions}
                                            ref={register({})}
                                            onChange={formUpdateSearchObj}
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
                            {!searchStatus && (
                                <div className="no-result">Do the search</div>
                            )}
                            {searchStatus && (
                                <TableAPI
                                    searchObj={searchObj}
                                    headers={headers}
                                    loading={loading}
                                    data={data}
                                    dataMeta={meta}
                                    onChange={handleTableChange}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default Clinicians;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";

import PageLayout from "layouts/PageLayout";

import { Button } from "components";
import PageTitle from "components/PageTitle";
import TableAPI from "components/elements/TableAPI";
import ContextSelect from "components/contextInputs/Select";
import FapIcon from "components/elements/FapIcon";

import useApiCall from "hooks/useApiCall";
import useSearch from "hooks/useSearch";

import { ACTIONS } from "helpers/table";

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
                        <Link
                            className="px-2"
                            to={`/admin/clinicians/${id}/edit`}
                        >
                            <FapIcon
                                size="1x"
                                icon="edit"
                                className="me-2 bg-secondary text-white rounded-circle p-1"
                            />
                        </Link>

                        <Link className="px-2">
                            <FapIcon
                                size="1x"
                                icon="info-circle"
                                className="me-2 bg-secondary text-white rounded-circle p-1"
                            />
                        </Link>
                    </>
                );
            },
        },
    ]);

    const [searchStatus, setSearchStatus] = useState(false);
    const [userStatusesOptions, setUserStatusesOptions] = useState([]);
    const [userTypesOptions, setUserTypesOptions] = useState([]);

    useEffect(() => {
        fireGetParams();
        redoSearch();
        setSearchStatus(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const [{ searchObj }, { formUpdateSearchObj, updateSearchObj }] = useSearch(
        {
            searchObj: {
                sortColumn: headers[0].columnMap,
                sortDirection: "asc",
                perPage: 10,
            },
        }
    );

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
            <Container fluid>
                <PageTitle
                    title="Clinicians"
                    actions={[
                        {
                            icon: "plus",
                            label: "Add",
                            onClick: handleNewClinician,
                        },
                    ]}
                    hideBack
                />

                <Row>
                    <Col md={12}>
                        <Row>
                            <Col md={3}>
                                <ContextSelect
                                    name="type_id"
                                    label="Type"
                                    options={userTypesOptions}
                                    onChange={formUpdateSearchObj}
                                />
                            </Col>

                            <Col md={3}>
                                <ContextSelect
                                    name="status_id"
                                    label="Status"
                                    options={userStatusesOptions}
                                    onChange={formUpdateSearchObj}
                                />
                            </Col>

                            <Col md={3}>
                                <Button
                                    variant="primary"
                                    disabled={loading}
                                    className="w-100"
                                    onClick={onSubmit}
                                    block
                                >
                                    Search
                                </Button>
                            </Col>
                        </Row>
                    </Col>

                    <Col md={12}>
                        {!searchStatus && (
                            <div className="text-center py-2 bg-white">
                                Do the search
                            </div>
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
                    </Col>
                </Row>
            </Container>
        </PageLayout>
    );
};

export default Clinicians;

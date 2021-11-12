import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import * as Yup from "yup";

import PageLayout from "layouts/PageLayout";

import { Button } from "components";
import PageTitle from "components/PageTitle";
import ContextInput from "components/inputs/ContextInput";
import PageAlert from "components/elements/PageAlert";
import TableAPI from "components/elements/TableAPI";
import Form from "components/elements/Form";
import Icon from "components/elements/Icon";

import useToast from "hooks/useToast";
import useApiCall from "hooks/useApiCall";
import useSearch from "hooks/useSearch";

import { ACTIONS } from "helpers/table";

const SearchMember = (props) => {
    const { generalError } = useToast();

    const [
        { loading, data: { data = [], meta = {} } = {}, error: searchError },
        memberSearch,
    ] = useApiCall({
        method: "post",
        url: "member/search",
    });

    const [headers] = useState([
        { columnMap: "member_number", label: "ID", type: String },
        { columnMap: "title", label: "Title", type: String },
        { columnMap: "first_name", label: "First Name", type: String },
        { columnMap: "last_name", label: "Last Name", type: String },
        { columnMap: "gender", label: "Gender", type: String },
        { columnMap: "dob", label: "Date of Birth", type: String },
        {
            columnMap: "address",
            label: "Address",
            type: String,
            formatter(address) {
                if (!address) return "";
                return [
                    address.address_1,
                    address.address_2,
                    `${address.city},`,
                    address.county,
                    address.state,
                    address.postal_code,
                ]
                    .filter(($item) => {
                        return !!$item;
                    })
                    .join(" ");
            },
        },
        {
            columnMap: "id",
            label: "Request",
            type: ACTIONS,
            disableSortBy: true,
            formatter(id) {
                return (
                    <Link
                        className="btn btn-primary btn-icon btn-sm"
                        to={`/member/${id}/request/add`}
                    >
                        <Icon icon="plus" className="me-1" size="sm" />
                        New Request
                    </Link>
                );
            },
        },
    ]);
    const [searchStatus, setSearchStatus] = useState(false);

    const validation = {
        first_name: {
            yupSchema: Yup.string().required("First Name is required"),
        },
        last_name: {
            yupSchema: Yup.string().required("Last Name is required"),
        },
        dob: {
            yupSchema: Yup.string().required("Date of Birth is required"),
        },
    };

    useEffect(() => {
        setSearchStatus(false);
    }, []);

    const handleSearch = (formValues) => {
        updateSearchObj(formValues);
        redoSearch({ ...searchObj, ...formValues });
    };

    const redoSearch = async (params = searchObj) => {
        try {
            await memberSearch({ params });
            setSearchStatus(true);
        } catch (e) {
            generalError();
        }
    };

    const handleTableChange = (props) => {
        updateSearchObj(props);
        redoSearch({ ...searchObj, ...props });
    };

    const handleAddMember = () => {
        props.history.push({
            pathname: "/healthplan/addmember",
            state: searchObj,
        });
    };

    const [{ searchObj }, { updateSearchObj }] = useSearch({
        searchObj: {
            sortColumn: headers[0].columnMap,
            sortDirection: "asc",
        },
    });

    return (
        <PageLayout>
            <Container fluid>
                <PageTitle title="Enter New Request" hideBack />

                {searchError ? (
                    <PageAlert
                        className="mt-3"
                        variant="warning"
                        timeout={5000}
                        dismissible
                    >
                        Error: {searchError}
                    </PageAlert>
                ) : null}
                <Row>
                    <Col md={12}>
                        <Form
                            autocomplete={false}
                            defaultData={searchObj}
                            validation={validation}
                            onSubmit={handleSearch}
                            className="p-0"
                        >
                            <Row>
                                <Col md={3}>
                                    <ContextInput
                                        label="First Name"
                                        name="first_name"
                                        placeholder="First Name"
                                    />
                                </Col>

                                <Col md={3}>
                                    <ContextInput
                                        label="Last Name"
                                        name="last_name"
                                        placeholder="Last Name"
                                    />
                                </Col>

                                <Col md={3}>
                                    <ContextInput
                                        name="dob"
                                        label="Date of Birth*"
                                        type="date"
                                        style={{ width: "100%" }}
                                    />
                                </Col>

                                <Col md={3}>
                                    <div className="d-md-block d-grid">
                                        <Button
                                            variant="primary"
                                            label="Search"
                                            type="submit"
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        {!data.length && !searchStatus && (
                            <div className="text-center mt-3">
                                Please search to show results
                            </div>
                        )}
                    </Col>
                    <Col md={12}>
                        {searchStatus && (
                            <>
                                <TableAPI
                                    searchObj={searchObj}
                                    headers={headers}
                                    data={data}
                                    loading={loading}
                                    dataMeta={meta}
                                    onChange={handleTableChange}
                                />

                                <div className="d-flex justify-content-center">
                                    <Button
                                        variant="primary"
                                        label="Add New Member"
                                        onClick={handleAddMember}
                                    />
                                </div>
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </PageLayout>
    );
};

export default SearchMember;

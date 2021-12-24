import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { isEmpty } from "lodash";

import PageLayout from "layouts/PageLayout";

import { Button } from "components";
import Checkbox from "components/inputs/Checkbox";
import TableAPI from "components/elements/TableAPI";
import Form from "components/elements/Form";
import PageTitle from "components/PageTitle";
import ContextInput from "components/inputs/ContextInput";
import ContextSelect from "components/contextInputs/Select";
import PhoneInput from "components/inputs/PhoneInput";
import ZipcodeInput from "components/inputs/ZipcodeInput";
import FapIcon from "components/elements/FapIcon";

import useApiCall from "hooks/useApiCall";
import useSearch from "hooks/useSearch";
import useToast from "hooks/useToast";

import { ACTIONS } from "helpers/table";

import "styles/clients.scss";

const Clients = (props) => {
    const { generalError } = useToast();
    const [
        {
            loading,
            data: { data = [], meta = {} },
        },
        fireDoSearch,
    ] = useApiCall({
        url: "/admin/payer",
    });

    const [{ data: categoryData }, requestCategoryData] = useApiCall({
        url: "/admin/company/categories",
    });

    const [searchStatus, setSearchStatus] = useState(false);
    const [checkList] = useState([]);
    const [checkedAll] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);

    const [headers] = useState([
        {
            columnMap: "id",
            label: (
                <Checkbox
                    className="mx-2"
                    checked={checkedAll}
                    onChange={() => handleCheckTableAll()}
                />
            ),
            type: String,
            disableSortBy: true,
            formatter(company_id) {
                return (
                    <Checkbox
                        className="mx-2"
                        checked={checkList.indexOf(company_id) >= 0}
                        onChange={() => handleCheckTableLine(company_id)}
                    />
                );
            },
        },
        { columnMap: "company_name", label: "Name", type: String },
        {
            columnMap: "address",
            label: "Street",
            type: String,
            formatter(address) {
                return (
                    <span>
                        {address?.address_1} {address?.address_2}
                    </span>
                );
            },
        },
        { columnMap: "address.city", label: "City", type: String },
        { columnMap: "address.state", label: "State", type: String },
        { columnMap: "address.postal_code", label: "Zip", type: String },
        { columnMap: "phone.number", label: "Phone", type: String },
        { columnMap: "company_category", label: "Category", type: String },
        { columnMap: "category.name", label: "Subcategory", type: String },
        {
            columnMap: "id",
            label: "Actions",
            type: ACTIONS,
            disableSortBy: true,
            formatter(id) {
                return (
                    <div className="actions">
                        <Link to={`/admin/client/${id}/edit`} className="mx-1">
                            <FapIcon size="1x" icon="edit" />
                        </Link>

                        <Link to={`/admin/client/${id}`} className="mx-1">
                            <FapIcon size="1x" icon="info-circle" />
                        </Link>
                    </div>
                );
            },
        },
    ]);

    const [{ searchObj }, { updateSearchObj }] = useSearch({
        searchObj: {
            sortColumn: headers[0].columnMap,
            sortDirection: "asc",
        },
    });

    useEffect(() => {
        setSearchStatus(false);

        requestCategoryData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isEmpty(categoryData)) {
            return;
        }

        const { categories, payer_categories } = categoryData;

        let categoryArr = [{ id: "", title: "", val: "" }];
        const categoryArrTemp = categories?.map(({ id, name }) => {
            return { id, title: name, val: id };
        });

        categoryArr = [...categoryArr, ...categoryArrTemp];

        const payerArr = [{ id: "", title: "", val: "" }];
        for (const [key, value] of Object.entries(payer_categories)) {
            payerArr.push({
                id: value.id,
                title: value.name,
                val: value.id,
                key,
            });
        }

        setCategoryOptions(categoryArr);
        setSubCategoryOptions(payerArr);
    }, [categoryData]);

    const redoSearch = async (params = searchObj) => {
        try {
            setSearchStatus(true);
            await fireDoSearch({ params });
        } catch (e) {
            generalError();
            console.log(e);
        }
    };

    const handleNewCompany = () => {
        props.history.push({
            pathname: "/admin/add-clients",
            state: {
                categoryOptions,
                subCategoryOptions,
            },
        });
    };

    const handleDuplication = () => {
        console.log("++++++++++++++handle duplication??++++++++++++++");
    };

    const handlePrint = () => {
        console.log("++++++++++++++handle print??++++++++++++++");
    };

    const handleCheckTableLine = (company_id) => {
        console.log("++++++++++++++++handle Table Line?++++++++++++++++++++");
    };

    const handleCheckTableAll = () => {
        console.log("++++++++++++++handleCheckTableAll+++++++++++++++");
    };

    const handleTableChange = (props) => {
        updateSearchObj(props);
        redoSearch({ ...searchObj, ...props });
    };

    return (
        <PageLayout>
            <Container fluid>
                <PageTitle
                    hideBack
                    title="Clients"
                    actions={[
                        {
                            icon: "plus",
                            label: "Add New",
                            onClick: handleNewCompany,
                        },
                    ]}
                />

                <Row>
                    <Col md={3}>
                        <Button
                            icon="copy"
                            size="sm"
                            className="me-3 text-white p-2 px-4"
                            variant="primary"
                            label="Duplicate"
                            onClick={handleDuplication}
                        />

                        <Button
                            icon="print"
                            size="sm"
                            className="me-3 text-white p-2 px-4"
                            variant="primary"
                            label="Print"
                            onClick={handlePrint}
                        />
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col md={12}>
                        <Form onSubmit={redoSearch} defaultData={searchObj}>
                            <Row>
                                <Col md={3}>
                                    <ContextInput
                                        name="company_name"
                                        label="Name"
                                    />
                                </Col>

                                <Col md={3}>
                                    <ContextInput
                                        name="address.address_1"
                                        label="Street"
                                    />
                                </Col>

                                <Col md={3}>
                                    <ContextInput
                                        name="address.city"
                                        label="City"
                                    />
                                </Col>

                                <Col md={3}>
                                    <ZipcodeInput
                                        name="address.zip"
                                        label="ZIP"
                                    />
                                </Col>

                                <Col md={3}>
                                    <PhoneInput
                                        type="phone"
                                        name="phone"
                                        label="Phone"
                                    />
                                </Col>

                                <Col md={3}>
                                    <ContextSelect
                                        name="category"
                                        label="Category"
                                        options={categoryOptions}
                                    />
                                </Col>

                                <Col md={3}>
                                    <ContextSelect
                                        name="subCategory"
                                        label="Subcategory"
                                        options={subCategoryOptions}
                                    />
                                </Col>

                                <Col md={3}>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={loading}
                                        className="w-100"
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
                    </Col>
                </Row>
            </Container>
        </PageLayout>
    );
};

export default Clients;

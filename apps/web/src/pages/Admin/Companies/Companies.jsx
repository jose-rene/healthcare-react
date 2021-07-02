import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";

import PageLayout from "../../../layouts/PageLayout";

import InputText from "../../../components/inputs/InputText";
import Select from "../../../components/inputs/Select";
import Button from "../../../components/inputs/Button";
import Checkbox from "../../../components/inputs/Checkbox";
import Icon from "../../../components/elements/Icon";

import TableAPI from "../../../components/elements/TableAPI";
import Form from "../../../components/elements/Form";

import { ACTIONS } from "../../../helpers/table";

import useSearch from "../../../hooks/useSearch";
import useApiCall from "../../../hooks/useApiCall";

import "../../../styles/companies.scss";

const Companies = (props) => {
    const [
        {
            loading,
            data: { data = [], meta = {} },
        },
        fireDoSearch,
    ] = useApiCall({
        url: "/admin/payer",
    });

    const [
        { loading: categoryLoading, data: categoryData },
        requestCategoryData,
    ] = useApiCall({
        url: "/admin/company/categories",
    });

    const [searchStatus, setSearchStatus] = useState(false);
    const [checkList, setCheckList] = useState([]);
    const [checkedAll, setCheckedAll] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);

    const [headers] = useState([
        {
            columnMap: "id",
            label: (
                <Checkbox
                    inline
                    className="px-auto header-checkbox"
                    checked={checkedAll}
                    onChange={() => handleCheckTableAll()}
                />
            ),
            type: ACTIONS,
            disableSortBy: true,
            formatter(company_id) {
                return (
                    <Checkbox
                        inline
                        className="px-auto header-checkbox"
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
                    <>
                        <Link to={`/admin/company/${id}/edit`}>
                            <Icon
                                size="1x"
                                icon="edit"
                                className="mr-2 bg-secondary text-white rounded-circle p-1"
                            />
                        </Link>

                        <Link to={`/admin/company/${id}`}>
                            <Icon
                                size="1x"
                                icon="info-circle"
                                className="mr-2 bg-secondary text-white rounded-circle p-1"
                            />
                        </Link>
                    </>
                );
            },
        },
    ]);

    const [{ searchObj }, { formUpdateSearchObj, updateSearchObj }] = useSearch(
        {
            searchObj: {
                sortColumn: headers[0].columnMap,
                sortDirection: "asc",
            },
        }
    );

    useEffect(() => {
        setSearchStatus(false);
    }, []);

    useEffect(() => {
        requestCategoryData();
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
            payerArr.push({ id: value.id, title: value.name, val: value.id });
        }

        setCategoryOptions(categoryArr);
        setSubCategoryOptions(payerArr);
    }, [categoryData]);

    const redoSearch = async (params = searchObj) => {
        try {
            setSearchStatus(true);
            await fireDoSearch({ params });
        } catch (e) {
            console.log(e);
        }
    };

    const handleFormSubmit = (e) => redoSearch();

    const handleNewCompany = () => {
        props.history.push({
            pathname: "/admin/add-companies",
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
            <div className="content-box">
                <div className="row px-3 pb-2 d-flex justify-content-between">
                    <div className="d-flex">
                        <h1 className="box-title mb-3 mr-4">Companies</h1>
                        <Button
                            icon="plus"
                            iconSize="sm"
                            className="btn btn-sm mb-3"
                            label="New"
                            onClick={() => handleNewCompany()}
                        />
                    </div>

                    <div className="d-flex">
                        <div className="d-flex justify-content-between">
                            <Button
                                icon="copy"
                                iconSize="sm"
                                className="btn btn-sm mb-3 mr-3"
                                variant="secondary"
                                label="Duplicate"
                                onClick={() => handleDuplication()}
                            />

                            <Button
                                icon="print"
                                iconSize="sm"
                                className="btn btn-sm mb-3 mr-3"
                                variant="secondary"
                                label="Print"
                                onClick={() => handlePrint()}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="col-md-12">
                        <Form onSubmit={handleFormSubmit}>
                            <div className="white-box white-box-small">
                                <div className="row m-0">
                                    <div className="col-md-3">
                                        <InputText
                                            name="name"
                                            label="Name"
                                            placeholder="Name"
                                            onChange={formUpdateSearchObj}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <InputText
                                            name="street"
                                            label="Street"
                                            placeholder="000 Street Ln."
                                            onChange={formUpdateSearchObj}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <InputText
                                            name="city"
                                            label="City"
                                            placeholder="City Name"
                                            onChange={formUpdateSearchObj}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <InputText
                                            name="zip"
                                            label="ZIP"
                                            placeholder="000000"
                                            onChange={formUpdateSearchObj}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <InputText
                                            name="phone"
                                            label="Phone"
                                            placeholder="(000) 000-0000"
                                            onChange={formUpdateSearchObj}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <Select
                                            name="category"
                                            label="Category"
                                            options={categoryOptions}
                                            onChange={formUpdateSearchObj}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <Select
                                            name="subCategory"
                                            label="Subcategory"
                                            options={subCategoryOptions}
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
                            <div className="row">
                                <div className="col-md-12">
                                    {!searchStatus && (
                                        <div className="no-result">
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default Companies;

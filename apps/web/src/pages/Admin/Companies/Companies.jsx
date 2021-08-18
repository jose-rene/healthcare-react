import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import PageLayout from "../../../layouts/PageLayout";
import { Button } from "components";
import Checkbox from "components/inputs/Checkbox";
import Icon from "components/elements/Icon";
import TableAPI from "components/elements/TableAPI";
import Form from "components/elements/Form";
import { ACTIONS } from "../../../helpers/table";
import useApiCall from "../../../hooks/useApiCall";
import PageTitle from "../../../components/PageTitle";
import TableSearchForm from "./TableSearchForm";
import useSearch from "../../../hooks/useSearch";
import useToast from "../../../hooks/useToast";
import "../../../styles/companies.scss";

const Companies = (props) => {
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
                    <div className="actions">
                        <Link
                            to={`/admin/company/${id}/edit`}
                            className="action bg-primary text-white"
                        >
                            <Icon size="1x" icon="edit" />
                        </Link>

                        <Link
                            to={`/admin/company/${id}`}
                            className="action  bg-info text-white"
                        >
                            <Icon size="1x" icon="info-circle" />
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
                <PageTitle
                    hideBack
                    title="Companies"
                    actions={[
                        {
                            icon: "plus",
                            label: "New",
                            onClick: handleNewCompany,
                        },
                    ]}
                />

                <div className="mb-3">
                    <Button
                        icon="copy"
                        size="sm"
                        className="me-3 text-white p-2 px-4"
                        variant="secondary"
                        label="Duplicate"
                        onClick={handleDuplication}
                    />

                    <Button
                        icon="print"
                        size="sm"
                        className="me-3 text-white p-2 px-4"
                        variant="secondary"
                        label="Print"
                        onClick={handlePrint}
                    />
                </div>

                <div className="form-row">
                    <div className="col-md-12">
                        <Form onSubmit={redoSearch} defaultData={searchObj}>
                            <TableSearchForm
                                categoryOptions={categoryOptions}
                                subCategoryOptions={subCategoryOptions}
                                loading={loading}
                                redoSearch={redoSearch}
                            />
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

import React, { useState, useEffect } from "react";

import PageLayout from "../../../layouts/PageLayout";

import InputText from "../../../components/inputs/InputText";
import Select from "../../../components/inputs/Select";
import Button from "../../../components/inputs/Button";
import Checkbox from "../../../components/inputs/Checkbox";

import TableAPI from "../../../components/elements/TableAPI";
import Form from "../../../components/elements/Form";

import { ACTIONS } from "../../../helpers/table";

import useSearch from "../../../hooks/useSearch";
import useApiCall from "../../../hooks/useApiCall";

import "../../../styles/companies.scss";

const testData = [
    {
        id: "first",
        name: "first",
        street: "first",
        city: "first",
        state: "first",
        zip: "first",
        phone: "first",
        category: "first",
        subCategory: "first",
    },
    {
        id: "second",
        name: "second",
        street: "second",
        city: "second",
        state: "second",
        zip: "second",
        phone: "second",
        category: "second",
        subCategory: "second",
    },
];

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

    const [searchStatus, setSearchStatus] = useState(false);
    const [checkList, setCheckList] = useState([]);
    const [checkedAll, setCheckedAll] = useState(false);

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
        { columnMap: "name", label: "Name", type: String },
        { columnMap: "street", label: "Street", type: String },
        { columnMap: "city", label: "City", type: String },
        { columnMap: "state", label: "State", type: String },
        { columnMap: "zip", label: "Zip", type: String },
        { columnMap: "phone", label: "Phone", type: String },
        { columnMap: "category", label: "Category", type: String },
        { columnMap: "subCategory", label: "Subcategory", type: String },
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
        props.history.push("/admin/add-companies");
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
                                            options={[
                                                {
                                                    id: "option1",
                                                    val: "option1",
                                                    title: "Option 1",
                                                },
                                                {
                                                    id: "option2",
                                                    val: "option2",
                                                    title: "Option 2",
                                                },
                                            ]}
                                            onChange={formUpdateSearchObj}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <Select
                                            name="subCategory"
                                            label="Subcategory"
                                            options={[
                                                {
                                                    id: "option1",
                                                    val: "option1",
                                                    title: "Option 1",
                                                },
                                                {
                                                    id: "option2",
                                                    val: "option2",
                                                    title: "Option 2",
                                                },
                                            ]}
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
                                            data={testData}
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

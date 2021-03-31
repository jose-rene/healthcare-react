import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

import PageLayout from "../../layouts/PageLayout";
import InputText from "../../components/inputs/InputText";
import PageAlert from "../../components/elements/PageAlert";
import TableAPI from "../../components/elements/TableAPI";
import Button from "../../components/inputs/Button";

import useApiCall from "../../hooks/useApiCall";
import useSearch from "../../hooks/useSearch";

import "../../styles/healthplan.scss";

const SearchMember = () => {
    const [
        { loading, data: { data = [], meta = {} } = {}, error: searchError },
        memberSearch,
    ] = useApiCall({
        method: "post",
        url: "member/search",
    });

    const [headers] = useState([
        { columnMap: "id", label: "ID", type: String },
        { columnMap: "first_name", label: "First Name", type: String },
        { columnMap: "last_name", label: "Last Name", type: String },
        { columnMap: "gender", label: "Gender", type: String },
        { columnMap: "title", label: "Title", type: String },
        { columnMap: "dob", label: "Date of Birth", type: String },
        {
            columnMap: "address",
            label: "Address",
            type: String,
            formatter (address) {
                return [
                    `${address.street}`,
                    `${address.city},`,
                    `${address.county}`,
                    `${address.state}`,
                    `${address.zip_code}`,
                ].join(" ");
            },
        },
    ]);
    const [searchStatus, setSearchStatus] = useState(false);

    const { register, handleSubmit, errors } = useForm();

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
            // console.log(e);
        }
    };

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

    if (loading) {
        return <div>Loading</div>;
    }

    return (
        <PageLayout>
            <div className="content-box">
                <h1 className="box-title" style={{ marginBottom: "0px" }}>
                    Enter New Request
                </h1>

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

                <div className="row">
                    <div className="col-md-12">
                        <div className="first-div mt-3">
                            <div className="row m-0">
                                <Form onSubmit={handleSubmit(handleSearch)}>
                                    <div className="d-flex mb-1 flex-sm-row flex-column">
                                        <div className="px-2 flex-grow-1">
                                            <InputText
                                                name="first_name"
                                                placeholder="First Name"
                                                value={
                                                    searchObj.first_name || ""
                                                }
                                                errors={errors}
                                                ref={register({
                                                    required:
                                                        "First Name is required",
                                                })}
                                                onChange={formUpdateSearchObj}
                                            />
                                        </div>

                                        <div className="px-2 flex-grow-1">
                                            <InputText
                                                name="last_name"
                                                placeholder="Last Name"
                                                value={
                                                    searchObj.last_name || ""
                                                }
                                                errors={errors}
                                                ref={register({
                                                    required:
                                                        "Last Name is required",
                                                })}
                                                onChange={formUpdateSearchObj}
                                            />
                                        </div>

                                        <div className="px-2 flex-grow-1">
                                            <InputText
                                                name="dob"
                                                placeholder="Date of Birth"
                                                value={searchObj.dob || ""}
                                                type="date"
                                                errors={errors}
                                                ref={register({
                                                    required:
                                                        "Date of Birth is required",
                                                })}
                                                onChange={formUpdateSearchObj}
                                            />
                                        </div>

                                        <div className="px-2 ml-auto">
                                            <Button
                                                className="px-3 py-1"
                                                variant="primary"
                                                label="Search"
                                                type="submit"
                                            />
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>

                        <div className="white-box white-box-small">
                            <div className="row">
                                <div className="col-md-12">
                                    {!data.length && !searchStatus && (
                                        <div className="no-result">
                                            Please search to show results
                                        </div>
                                    )}
                                    {searchStatus && (
                                        <TableAPI
                                            searchObj={searchObj}
                                            headers={headers}
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

export default SearchMember;

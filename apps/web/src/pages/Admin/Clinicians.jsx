import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

import InputText from "../../components/inputs/InputText";
import Button from "../../components/inputs/Button";

import Icon from "../../components/elements/Icon";
import TableAPI from "../../components/elements/TableAPI";

import PageLayout from "../../layouts/PageLayout";

import { ACTIONS } from "../../helpers/table";

import useApiCall from "../../hooks/useApiCall";

const Clinicians = () => {
    const [
        {
            loading,
            data: { data = [], meta = {} },
        },
        fireDoSearch,
    ] = useApiCall({
        url: "admin/clinicaluser/params",
    });

    useEffect(() => {
        fireDoSearch();
    }, []);

    const [headers] = useState([
        { columnMap: "name", label: "Name", type: String },
        { columnMap: "type", label: "Type", type: String },
        { columnMap: "status", label: "Status", type: String },
        { columnMap: "notes", label: "Notes", type: String },
        {
            columnMap: "id",
            label: "Actions",
            type: ACTIONS,
            disableSortBy: true,
            formatter(id) {
                return (
                    <>
                        <Icon
                            size="1x"
                            icon="edit"
                            className="mr-2 bg-secondary text-white rounded-circle p-1"
                        />

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

    const { handleSubmit } = useForm();

    const onSubmit = async (formData) => {
        console.log("+++++++++++++++++++", formData);
    };

    return (
        <PageLayout>
            <div className="content-box">
                <h1 className="box-title mb-0">Clinicians</h1>

                <div className="form-row">
                    <div className="col-md-12">
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <div className="white-box white-box-small">
                                <div className="row m-0">
                                    <div className="col-md-3">
                                        <InputText
                                            name="missing"
                                            label="Missing"
                                            placeholder="Missing"
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <InputText
                                            name="expired"
                                            label="Expired"
                                            placeholder="Expired"
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <InputText
                                            name="expiring"
                                            label="Expiring"
                                            placeholder="Expiring"
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <InputText
                                            name="unverified"
                                            label="Unverified"
                                            placeholder="Unverified"
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <InputText
                                            name="fwa"
                                            label="FWA"
                                            placeholder="FWA"
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <InputText
                                            name="pending"
                                            label="Pending"
                                            placeholder="Pending"
                                        />
                                    </div>

                                    <div className="col-md-3 align-self-end">
                                        <Button
                                            type="submit"
                                            // disabled={loading}
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
                            <TableAPI
                                searchObj={{}}
                                headers={headers}
                                loading={false}
                                data={[]}
                                dataMeta={{}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default Clinicians;

import React, { useState, useEffect } from "react";

import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

import PageLayout from "../../../layouts/PageLayout";
import Button from "../../../components/inputs/Button";
import InputText from "../../../components/inputs/InputText";
import Select from "../../../components/inputs/Select";

import PageAlert from "../../../components/elements/PageAlert";

import useApiCall from "../../../hooks/useApiCall";

const AddCompanies = (props) => {
    const [{ error: formError }, postCompanyRequest] = useApiCall({
        method: "post",
        url: "admin/company",
    });

    const [categoryOptions, setCategoryOptions] = useState([]);
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);
    const [showSubcategory, setShowSubcategory] = useState(false);

    const { handleSubmit, register, watch, errors } = useForm();

    useEffect(() => {
        if (props.history.location.state) {
            const {
                categoryOptions,
                subCategoryOptions,
            } = props.history.location.state;

            setCategoryOptions(categoryOptions);
            setSubCategoryOptions(subCategoryOptions);
        }
    }, [props.history.location.state]);

    const company_type = watch("category", "");

    useEffect(() => {
        // Company Type 1, Payer
        if (company_type === "1") {
            setShowSubcategory(true);
        } else {
            setShowSubcategory(false);
        }
    }, [company_type]);

    const handleBack = () => {
        props.history.push("/admin/companies");
    };

    const onSubmit = async (formValues) => {
        try {
            const result = await postCompanyRequest({ params: formValues });

            props.history.push(`/admin/company/${result.id}`);
        } catch (e) {
            console.log("Company create error:", e);
        }
    };

    return (
        <PageLayout>
            <div className="content-box">
                <div className="row d-flex justify-content-start p-3">
                    <div className="d-flex">
                        <Button
                            icon="chevron-left"
                            iconSize="sm"
                            className="btn btn-sm mb-5 py-2 px-3"
                            outline
                            label="Back"
                            onClick={() => handleBack()}
                        />

                        <h1 className="box-title ml-4">Add Company</h1>
                    </div>
                </div>

                <div className="col-md-6">
                    {formError ? (
                        <PageAlert
                            className="mt-3"
                            variant="warning"
                            timeout={5000}
                            dismissible
                        >
                            Error: {formError}
                        </PageAlert>
                    ) : null}
                </div>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-row">
                        <div className="col-md-4">
                            <InputText
                                name="name"
                                label="Company Name"
                                ref={register({
                                    required: "Company Name is required",
                                })}
                                errors={errors}
                            />
                        </div>
                        <div className="col-md-4">
                            <Select
                                name="category"
                                label="Company Type"
                                options={categoryOptions}
                                ref={register({
                                    required: "Company Type is required",
                                })}
                                errors={errors}
                            />
                        </div>
                        <div className="col-md-4">
                            {showSubcategory && (
                                <Select
                                    name="payer_category"
                                    label="Payer Type"
                                    options={subCategoryOptions}
                                    ref={register({
                                        required: "Payer Type is required",
                                    })}
                                    errors={errors}
                                />
                            )}
                        </div>

                        <div className="col-md-12">
                            <Button
                                type="submit"
                                className="btn btn-block btn-primary mb-md-3 py-2"
                                label="Add"
                            />
                        </div>
                        <div className="col-md-6">
                            {formError ? (
                                <PageAlert
                                    className="mt-3"
                                    variant="warning"
                                    timeout={5000}
                                    dismissible
                                >
                                    Error: {formError}
                                </PageAlert>
                            ) : null}
                        </div>
                    </div>
                </Form>
            </div>
        </PageLayout>
    );
};

export default AddCompanies;

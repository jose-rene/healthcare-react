import React, { useState, useEffect } from "react";

import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

import PageLayout from "../../../layouts/PageLayout";

import Button from "../../../components/inputs/Button";
import Select from "../../../components/inputs/Select";
import InputText from "../../../components/inputs/InputText";

import PageAlert from "../../../components/elements/PageAlert";

import useApiCall from "../../../hooks/useApiCall";
import useToast from "../../../hooks/useToast";

const AddClinicians = (props) => {
    const [
        {
            loading: paramsSearch,
            data: {
                roles = [],
                types = [],
                user_types = [],
                user_statuses = [],
                therapy_networks = [],
            },
        },
        fireGetParams,
    ] = useApiCall({
        url: "admin/clinicaluser/params",
    });

    const [
        { data, loading, error: formError },
        postCliniciansRequest,
    ] = useApiCall({
        method: "post",
        url: "admin/clinicaluser",
    });

    const { handleSubmit, register, errors } = useForm();

    const { success: successMessage } = useToast();

    const [typesOptions, setTypesOptions] = useState([]);
    const [userTypesOptions, setUserTypesOptions] = useState([]);
    const [userStatusesOptions, setUserStatusesOptions] = useState([]);
    const [therapyNetworksOptions, setTherapyNetworksOptions] = useState([]);
    const [rolesOptions, setRolesOptions] = useState([]);

    useEffect(() => {
        fireGetParams();
    }, []);

    useEffect(() => {
        const typesArr = [{ id: "", title: "", val: "" }];
        types.forEach(({ id, name }) => {
            typesArr.push({
                id,
                title: name,
                val: id,
            });
        });

        setTypesOptions(typesArr);
    }, [types]);

    useEffect(() => {
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

    useEffect(() => {
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
        const therapyNetworksArr = [{ id: "", title: "", val: "" }];
        therapy_networks.forEach(({ id, name }) => {
            therapyNetworksArr.push({
                id,
                title: name,
                val: id,
            });
        });

        setTherapyNetworksOptions(therapyNetworksArr);
    }, [therapy_networks]);

    useEffect(() => {
        const rolesArr = [{ id: "", title: "", val: "" }];
        roles.forEach(({ name, title }) => {
            rolesArr.push({
                id: name,
                title,
                val: name,
            });
        });

        setRolesOptions(rolesArr);
    }, [roles]);

    const handleBack = () => {
        props.history.push("/admin/clinicians");
    };

    const onSubmit = async (formValues) => {
        try {
            const result = await postCliniciansRequest({ params: formValues });

            props.history.push(`/admin/clinicians`);
            successMessage("Clinician successfully added.");
        } catch (e) {
            console.log("Clinicians create error:", e);
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

                        <h1 className="box-title ml-4">Add Clinicians</h1>
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
                        <div className="col-md-6">
                            <Select
                                name="clinical_type_id"
                                label="Type*"
                                options={typesOptions}
                                ref={register({
                                    required: "Type is required",
                                })}
                                errors={errors}
                            />
                        </div>
                        <div className="col-md-6">
                            <Select
                                name="clinical_user_type_id"
                                label="User Type*"
                                options={userTypesOptions}
                                ref={register({
                                    required: "User Type is required",
                                })}
                                errors={errors}
                            />
                        </div>
                        <div className="col-md-6">
                            <Select
                                name="clinical_user_status_id"
                                label="Status*"
                                options={userStatusesOptions}
                                ref={register({
                                    required: "Status is required",
                                })}
                                errors={errors}
                            />
                        </div>
                        <div className="col-md-6">
                            <Select
                                name="therapy_network_id"
                                label="Therapy Network"
                                options={therapyNetworksOptions}
                                ref={register({})}
                                errors={errors}
                            />
                        </div>
                        <div className="col-md-6">
                            <Select
                                name="primary_role"
                                label="Primary Role*"
                                options={rolesOptions}
                                ref={register({
                                    required: "Primary Role is required",
                                })}
                                errors={errors}
                            />
                        </div>
                        <div className="col-md-6">
                            <InputText
                                name="job_title"
                                label="Job Title*"
                                ref={register({
                                    required: "Job Title is required",
                                })}
                                errors={errors}
                            />
                        </div>
                        <div className="col-md-6">
                            <InputText
                                name="first_name"
                                label="First Name*"
                                ref={register({
                                    required: "First Name is required",
                                })}
                                errors={errors}
                            />
                        </div>
                        <div className="col-md-6">
                            <InputText
                                name="last_name"
                                label="Last Name*"
                                ref={register({
                                    required: "Last Name is required",
                                })}
                                errors={errors}
                            />
                        </div>
                        <div className="col-md-6">
                            <InputText
                                name="email"
                                label="Email*"
                                type="email"
                                ref={register({
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message:
                                            "Please enter a valid email address",
                                    },
                                })}
                                errors={errors}
                            />
                        </div>
                        <div className="col-md-6">
                            <InputText
                                name="phone"
                                label="Phone*"
                                ref={register({
                                    required: "Phone is required",
                                })}
                                errors={errors}
                            />
                        </div>

                        <div className="col-md-12 mt-2">
                            <Button
                                type="submit"
                                className="btn btn-block btn-primary"
                                label="Add"
                            />
                        </div>
                    </div>
                </Form>
            </div>
        </PageLayout>
    );
};

export default AddClinicians;

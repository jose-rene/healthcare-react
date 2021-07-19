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
    const { handleSubmit, register, errors } = useForm();

    const { success: successMessage } = useToast();

    const [typesOptions, setTypesOptions] = useState([]);
    const [userTypesOptions, setUserTypesOptions] = useState([]);
    const [userStatusesOptions, setUserStatusesOptions] = useState([]);
    const [therapyNetworksOptions, setTherapyNetworksOptions] = useState([]);
    const [rolesOptions, setRolesOptions] = useState([]);

    const editCliniciansId = props.location.pathname.split("/")[3];
    const pageStatus =
        props.location.pathname.split("/")[4] === "edit" ? "Update" : "Add";

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

    const [
        { data: updateData, loading: updateLoading, error: formUpdateError },
        updateCliniciansRequest,
    ] = useApiCall({
        method: "put",
        url: `admin/clinicaluser/${editCliniciansId}`,
    });

    const [
        { data: editClinicians, loading: editLoading, error: editError },
        getEditCliniciansRequest,
    ] = useApiCall({
        url: `admin/clinicaluser/${editCliniciansId}`,
    });

    useEffect(() => {
        fireGetParams();
        getEditCliniciansRequest();
    }, [editCliniciansId]);

    useEffect(() => {
        const typesArr = [{ id: "", title: "", val: "" }];
        types.forEach(({ id, name }) => {
            typesArr.push({
                id,
                title: name,
                val: id,
                selected:
                    editClinicians?.clinical_type?.id === id
                        ? "selected"
                        : false,
            });
        });

        setTypesOptions(typesArr);
    }, [types, editClinicians]);

    useEffect(() => {
        const typesArr = [{ id: "", title: "", val: "" }];
        user_types.forEach(({ id, name }) => {
            typesArr.push({
                id,
                title: name,
                val: id,
                selected:
                    editClinicians?.clinical_user_type?.id === id
                        ? "selected"
                        : false,
            });
        });

        setUserTypesOptions(typesArr);
    }, [user_types, editClinicians]);

    useEffect(() => {
        const statusesArr = [{ id: "", title: "", val: "" }];
        user_statuses.forEach(({ id, name }) => {
            statusesArr.push({
                id,
                title: name,
                val: id,
                selected:
                    editClinicians?.clinical_user_status?.id === id
                        ? "selected"
                        : false,
            });
        });

        setUserStatusesOptions(statusesArr);
    }, [user_statuses, editClinicians]);

    useEffect(() => {
        const therapyNetworksArr = [{ id: "", title: "", val: "" }];
        therapy_networks.forEach(({ id, name }) => {
            therapyNetworksArr.push({
                id,
                title: name,
                val: id,
                selected:
                    editClinicians?.therapy_network?.id === id
                        ? "selected"
                        : false,
            });
        });

        setTherapyNetworksOptions(therapyNetworksArr);
    }, [therapy_networks, editClinicians]);

    useEffect(() => {
        const rolesArr = [{ id: "", title: "", val: "" }];
        roles.forEach(({ name, title }) => {
            rolesArr.push({
                id: name,
                title,
                val: name,
                selected:
                    editClinicians?.primary_role === name ? "selected" : false,
            });
        });

        setRolesOptions(rolesArr);
    }, [roles, editClinicians]);

    const handleBack = () => {
        props.history.push("/admin/clinicians");
    };

    const onSubmit = async (formValues) => {
        try {
            if (pageStatus === "Add") {
                const result = await postCliniciansRequest({
                    params: formValues,
                });

                successMessage("Clinician successfully added.");
            } else if (pageStatus === "Update") {
                const result = await updateCliniciansRequest({
                    params: formValues,
                });

                successMessage("Clinician successfully updated.");
            }

            props.history.push(`/admin/clinicians`);
        } catch (e) {
            if (pageStatus === "Add") {
                console.log("Clinicians create error:", e);
            } else if (pageStatus === "Update") {
                console.log("Clinicians update error:", e);
            }
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

                        <h1 className="box-title ml-4">
                            {pageStatus === "Update" ? "Edit" : "Add"}{" "}
                            Clinicians
                        </h1>
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
                    {formUpdateError ? (
                        <PageAlert
                            className="mt-3"
                            variant="warning"
                            timeout={5000}
                            dismissible
                        >
                            Error: {formUpdateError}
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
                                defaultValue={editClinicians?.clinical_type?.id}
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
                                defaultValue={
                                    editClinicians?.clinical_user_type?.id
                                }
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
                                defaultValue={
                                    editClinicians?.clinical_user_status?.id
                                }
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
                                defaultValue={
                                    editClinicians?.therapy_network?.id
                                }
                                ref={register({})}
                                errors={errors}
                            />
                        </div>
                        <div className="col-md-6">
                            <Select
                                name="primary_role"
                                label="Primary Role*"
                                options={rolesOptions}
                                defaultValue={editClinicians?.primary_role}
                                ref={register({
                                    required: "Primary Role is required",
                                })}
                                errors={errors}
                            />
                        </div>
                        <div className="col-md-6">
                            <InputText
                                name="title"
                                label="Title*"
                                defaultValue={editClinicians?.title}
                                ref={register({
                                    required: "Title is required",
                                })}
                                errors={errors}
                            />
                        </div>
                        <div className="col-md-6">
                            <InputText
                                name="first_name"
                                label="First Name*"
                                defaultValue={editClinicians?.first_name}
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
                                defaultValue={editClinicians?.last_name}
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
                                defaultValue={editClinicians?.email}
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
                                defaultValue={editClinicians?.phone_primary}
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
                                label={pageStatus}
                            />
                        </div>
                    </div>
                </Form>
            </div>
        </PageLayout>
    );
};

export default AddClinicians;

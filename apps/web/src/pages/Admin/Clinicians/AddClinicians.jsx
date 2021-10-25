import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import * as Yup from "yup";

import PageLayout from "layouts/PageLayout";

import { Button } from "components";
import PageTitle from "components/PageTitle";
import Form from "components/elements/Form";
import ContextInput from "components/inputs/ContextInput";
import ContextSelect from "components/contextInputs/Select";
import PhoneInput from "components/inputs/PhoneInput";
import ContextCheckbox from "components/contextInputs/Checkbox";

import PageAlert from "components/elements/PageAlert";

import useApiCall from "hooks/useApiCall";
import useToast from "hooks/useToast";

const AddClinicians = (props) => {
    const { success: successMessage } = useToast();

    const [typesOptions, setTypesOptions] = useState([]);
    const [userTypesOptions, setUserTypesOptions] = useState([]);
    const [userStatusesOptions, setUserStatusesOptions] = useState([]);
    const [therapyNetworksOptions, setTherapyNetworksOptions] = useState([]);
    const [rolesOptions, setRolesOptions] = useState([]);
    const [defaultData, setDefaultData] = useState({});

    const validation = {
        clinical_type_id: {
            yupSchema: Yup.string().required("Type is required"),
        },
        clinical_user_type_id: {
            yupSchema: Yup.string().required("User Type is required"),
        },
        clinical_user_status_id: {
            yupSchema: Yup.string().required("Status is required"),
        },
        primary_role: {
            yupSchema: Yup.string().required("Primary Role is required"),
        },
        job_title: {
            yupSchema: Yup.string().required("Job Title is required"),
        },
        first_name: {
            yupSchema: Yup.string().required("First Name is required"),
        },
        last_name: {
            yupSchema: Yup.string().required("Last Name is required"),
        },
        email: {
            yupSchema: Yup.string()
                .matches(
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    "Please enter a valid email address"
                )
                .required("Email is required"),
        },
        phone: {
            yupSchema: Yup.string().required("Phone is required"),
        },
    };

    const editCliniciansId = props.location.pathname.split("/")[3];
    const pageStatus =
        props.location.pathname.split("/")[4] === "edit" ? "Update" : "Add";

    const [
        {
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

    const [{ loading: addLoading, error: formError }, postCliniciansRequest] =
        useApiCall({
            method: "post",
            url: "admin/clinicaluser",
        });

    const [
        { loading: updateLoading, error: formUpdateError },
        updateCliniciansRequest,
    ] = useApiCall({
        method: "put",
        url: `admin/clinicaluser/${editCliniciansId}`,
    });

    const [{ data: editClinicians }, getEditCliniciansRequest] = useApiCall({
        url: `admin/clinicaluser/${editCliniciansId}`,
    });

    useEffect(() => {
        fireGetParams();
        getEditCliniciansRequest();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editCliniciansId]);

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
    }, [types, editClinicians]);

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
    }, [user_types, editClinicians]);

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
    }, [user_statuses, editClinicians]);

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
    }, [therapy_networks, editClinicians]);

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
    }, [roles, editClinicians]);

    useEffect(() => {
        setDefaultData({
            clinical_type_id: editClinicians?.clinical_type?.id,
            clinical_user_type_id: editClinicians?.clinical_user_type?.id,
            clinical_user_status_id: editClinicians?.clinical_user_status?.id,
            therapy_network_id: editClinicians?.therapy_network?.id,
            primary_role: editClinicians?.primary_role,
            job_title: editClinicians?.job_title,
            first_name: editClinicians?.first_name,
            last_name: editClinicians?.last_name,
            email: editClinicians?.email,
            phone: editClinicians?.phone_primary,
            is_preferred: editClinicians?.is_preferred,
            is_test: editClinicians?.is_test,
        });
    }, [editClinicians]);

    const handleBack = () => {
        props.history.push("/admin/clinicians");
    };

    const onSubmit = async (formValues) => {
        let result;
        try {
            if (pageStatus === "Add") {
                result = await postCliniciansRequest({
                    params: formValues,
                });

                if (result) {
                    successMessage("Clinician successfully added.");
                }
            } else if (pageStatus === "Update") {
                result = await updateCliniciansRequest({
                    params: formValues,
                });

                if (result) {
                    successMessage("Clinician successfully updated.");
                }
            }

            setDefaultData({
                clinical_type_id: result?.clinical_type?.id,
                clinical_user_type_id: result?.clinical_user_type?.id,
                clinical_user_status_id: result?.clinical_user_status?.id,
                therapy_network_id: result?.therapy_network?.id,
                primary_role: result?.primary_role,
                job_title: result?.job_title,
                first_name: result?.first_name,
                last_name: result?.last_name,
                email: result?.email,
                phone: result?.phone_primary,
                is_preferred: result?.is_preferred,
                is_test: result?.is_test,
            });
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
            <Container fluid>
                <Row>
                    <Col>
                        <PageTitle
                            title={
                                pageStatus === "Update"
                                    ? "Edit Clinician"
                                    : "Add Clinician"
                            }
                            onBack={handleBack}
                        />
                    </Col>
                </Row>

                <Col md={6}>
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
                </Col>
                <Form
                    autocomplete={false}
                    validation={validation}
                    defaultData={defaultData}
                    onSubmit={onSubmit}
                >
                    <Row>
                        <Col md={6}>
                            <ContextSelect
                                name="clinical_type_id"
                                label="Type*"
                                options={typesOptions}
                            />
                        </Col>
                        <Col md={6}>
                            <ContextSelect
                                name="clinical_user_type_id"
                                label="User Type*"
                                options={userTypesOptions}
                            />
                        </Col>
                        <Col md={6}>
                            <ContextSelect
                                name="clinical_user_status_id"
                                label="Status*"
                                options={userStatusesOptions}
                            />
                        </Col>
                        <Col md={6}>
                            <ContextSelect
                                name="therapy_network_id"
                                label="Therapy Network"
                                options={therapyNetworksOptions}
                            />
                        </Col>
                        <Col md={6}>
                            <ContextSelect
                                name="primary_role"
                                label="Primary Role*"
                                options={rolesOptions}
                            />
                        </Col>
                        <Col md={6}>
                            <ContextInput name="job_title" label="Job Title*" />
                        </Col>
                        <Col md={6}>
                            <ContextInput
                                name="first_name"
                                label="First Name*"
                            />
                        </Col>
                        <Col md={6}>
                            <ContextInput name="last_name" label="Last Name*" />
                        </Col>
                        <Col md={6}>
                            <ContextInput
                                name="email"
                                label="Email*"
                                type="email"
                            />
                        </Col>
                        <Col md={6}>
                            <PhoneInput
                                type="phone"
                                name="phone"
                                label="Phone"
                            />
                        </Col>
                        <Col md={6}>
                            <div className="form-check form-check-inline ps-0">
                                <ContextCheckbox
                                    label="Preferred"
                                    name="is_preferred"
                                    wrapperClass="form-check py-1 px-0"
                                />
                            </div>

                            <div className="form-check form-check-inline">
                                <ContextCheckbox
                                    label="Test User"
                                    name="is_test"
                                    wrapperClass="form-check py-1 px-0"
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row className="mt-3">
                        <Col md={3}>
                            <Button
                                type="submit"
                                label={pageStatus}
                                variant="primary"
                                disabled={
                                    pageStatus === "Update"
                                        ? updateLoading
                                        : addLoading
                                }
                                block
                            />
                        </Col>
                    </Row>
                </Form>
            </Container>
        </PageLayout>
    );
};

export default AddClinicians;

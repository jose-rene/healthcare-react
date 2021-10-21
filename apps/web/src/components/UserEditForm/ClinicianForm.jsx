import React, { useEffect, useMemo, useState } from "react";
import { Row, Col } from "react-bootstrap";
import * as Yup from "yup";
import { Button } from "components";
import Form from "components/elements/Form";
import ContextInput from "components/inputs/ContextInput";
import ContextSelect from "components/contextInputs/Select";
import useApiCall from "hooks/useApiCall";

const ClinicianForm = ({
    editUserData: {
        primary_role,
        clinical_type,
        clinical_user_type,
        clinical_user_status,
        therapy_network,
        first_name,
        last_name,
        email,
        phone_primary: phone,
        job_title,
    },
    onSubmit,
    updateLoading,
}) => {
    // default data for form
    const [defaultData, setDefaultData] = useState({
        primary_role,
        clinical_type_id: clinical_type?.id ?? "",
        clinical_user_type_id: clinical_user_type?.id ?? "",
        clinical_user_status_id: clinical_user_status?.id ?? "",
        therapy_network_id: therapy_network?.id ?? "",
        first_name,
        last_name,
        email,
        phone,
        job_title,
    });

    // validation
    const validation = {
        first_name: {
            yupSchema: Yup.string().required("Name is required"),
        },
        last_name: {
            yupSchema: Yup.string().required("Name is required"),
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
        primary_role: {
            yupSchema: Yup.string().required("Role is required"),
        },
        job_title: {
            yupSchema: Yup.string().required("Job Title is required"),
        },
        clinical_type_id: {
            yupSchema: Yup.string().required("Type is required"),
        },
    };

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

    useEffect(() => {
        fireGetParams();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const typesOptions = useMemo(() => {
        if (!types) return;

        const typesArr = [{ id: "", title: "", val: "" }];
        types.forEach(({ id, name }) => {
            typesArr.push({
                id,
                title: name,
                val: id,
            });
        });

        return typesArr;
    }, [types]);

    const rolesOptions = useMemo(() => {
        if (!roles) return;

        const rolesArr = [{ id: "", title: "", val: "" }];
        roles.forEach(({ name, title }) => {
            rolesArr.push({
                id: name,
                title,
                val: name,
            });
        });

        return rolesArr;
    }, [roles]);

    const userStatusesOptions = useMemo(() => {
        const statusesArr = [{ id: "", title: "", val: "" }];
        user_statuses.forEach(({ id, name }) => {
            statusesArr.push({
                id,
                title: name,
                val: id,
            });
        });

        return statusesArr;
    }, [user_statuses]);

    const therapyNetworksOptions = useMemo(() => {
        const therapyNetworksArr = [{ id: "", title: "", val: "" }];
        therapy_networks.forEach(({ id, name }) => {
            therapyNetworksArr.push({
                id,
                title: name,
                val: id,
            });
        });

        return therapyNetworksArr;
    }, [therapy_networks]);

    const userTypeOptions = useMemo(() => {
        const arr = [{ id: "", title: "", val: "" }];
        user_types.forEach(({ id, name }) => {
            arr.push({
                id,
                title: name,
                val: id,
            });
        });

        return arr;
    }, [user_types]);

    return (
        <Form
            autocomplete={false}
            defaultData={defaultData}
            validation={validation}
            onSubmit={(values) => {
                onSubmit(values, "clinician");
            }}
        >
            <Row>
                <Col md={6}>
                    <ContextInput name="first_name" label="First Name" />
                </Col>
                <Col md={6}>
                    <ContextInput name="last_name" label="Last Name" />
                </Col>
                <Col md={6}>
                    <ContextInput name="email" label="Email" />
                </Col>
                <Col md={6}>
                    <ContextInput name="phone" label="Phone" />
                </Col>
                <Col md={6}>
                    <ContextSelect
                        name="primary_role"
                        label="Role"
                        options={rolesOptions}
                    />
                </Col>
                <Col md={6}>
                    <ContextInput name="job_title" label="Job Title*" />
                </Col>
                <Col md={6}>
                    <ContextSelect
                        name="clinical_type_id"
                        label="Type"
                        options={typesOptions}
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
                        name="clinical_user_type_id"
                        label="User Type*"
                        options={userTypeOptions}
                    />
                </Col>
                <Col md={6}>
                    <ContextSelect
                        name="therapy_network_id"
                        label="Therapy Network"
                        options={therapyNetworksOptions}
                    />
                </Col>
                <Col md={3}>
                    <Button
                        type="submit"
                        label="Update"
                        variant="primary"
                        disabled={updateLoading}
                        block
                    />
                </Col>
            </Row>
        </Form>
    );
};

export default ClinicianForm;

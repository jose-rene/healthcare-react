import React, { useState } from "react";
import * as Yup from "yup";
import { get, isEmpty } from "lodash";

import PageLayout from "layouts/PageLayout";

import BroadcastAlert from "components/elements/BroadcastAlert";
import PageAlert from "components/elements/PageAlert";
import ContextInput from "components/inputs/ContextInput";
import ContextSelect from "components/contextInputs/Select";
import ContextCheckbox from "components/contextInputs/Checkbox";
import FormButtons from "components/contextInputs/FormButtons";
import Form from "components/elements/Form";

import useApiCall from "hooks/useApiCall";

import "styles/home.scss";
import PageTitle from "components/PageTitle";
import { Container, Row, Col } from "react-bootstrap";

const AddUser = () => {
    const [{ loading, error: formError }, fireSubmit] = useApiCall({
        method: "post",
        url: "user",
    });

    const [user, setUser] = useState({});

    const validation = {
        primary_role: {
            yupSchema: Yup.string().required("User Type is required"),
        },
        job_title: {
            yupSchema: Yup.string()
                .required("Job Title is required")
                .min(2, "Job Title must be at least 2 character")
                .max(64, "Job Title cannot be longer than 64 characters"),
        },
        first_name: {
            yupSchema: Yup.string()
                .required("First Name is required")
                .min(2, "First Name must be at least 1 character")
                .max(64, "First Name cannot be longer than 64 characters"),
        },
        last_name: {
            yupSchema: Yup.string()
                .required("Last Name is required")
                .min(2, "Last Name must be at least 1 character")
                .max(64, "Last Name cannot be longer than 64 characters"),
        },
        email: {
            yupSchema: Yup.string()
                .required("Email is required")
                .email("Please enter a valid email"),
        },
        phone: {
            yupSchema: Yup.string().required("Phone is required"),
        },
    };

    const onSubmit = async (formData) => {
        if (loading) {
            return false;
        }
        try {
            const result = await fireSubmit({ params: formData });
            setUser({ ...result, phone: result.phone_primary });
        } catch (e) {
            console.log("User create error:", e);
        }
    };

    return (
        <PageLayout>
            <Container fluid>
                <BroadcastAlert />
                <PageTitle title="Add User" href="/dashboard" />
                <Row>
                    <Col lg={6}>
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
                        {!isEmpty(user) ? (
                            <PageAlert
                                className="mt-3"
                                variant="success"
                                timeout={5000}
                                dismissible
                            >
                                User Successfully Added.
                            </PageAlert>
                        ) : null}
                        <Form
                            autocomplete={false}
                            defaultData={user}
                            validation={validation}
                            onSubmit={onSubmit}
                        >
                            <div className="form-row mb-3">
                                <Col md={6}>
                                    <ContextSelect
                                        name="primary_role"
                                        label="User Type"
                                        options={[
                                            { id: "", title: "", val: "" },
                                            {
                                                id: "hp_user",
                                                title: "Health Plan User",
                                                val: "hp_user",
                                            },
                                            {
                                                id: "hp_finance",
                                                title: "Health Plan Finance",
                                                val: "hp_finance",
                                            },
                                            {
                                                id: "hp_champion",
                                                title: "Health Plan Champion",
                                                val: "hp_champion",
                                            },
                                            {
                                                id: "hp_manager",
                                                title: "Health Plan Manager",
                                                val: "hp_manager",
                                            },
                                        ]}
                                        required
                                        large
                                    />
                                </Col>
                                <Col md={6}>
                                    <ContextInput
                                        label="Job Title"
                                        name="job_title"
                                        placeholder="Enter your Job Title"
                                        required
                                        large
                                    />
                                </Col>
                                <Col md={6}>
                                    <ContextInput
                                        label="First Name"
                                        name="first_name"
                                        placeholder="Enter your First Name"
                                        required
                                        large
                                    />
                                </Col>
                                <Col md={6}>
                                    <ContextInput
                                        label="Last Name"
                                        name="last_name"
                                        placeholder="Enter your Last Name"
                                        required
                                        large
                                    />
                                </Col>
                                <Col md={6}>
                                    <ContextInput
                                        label="Email"
                                        name="email"
                                        placeholder="Enter your Email"
                                        required
                                        large
                                    />
                                </Col>
                                <Col md={6}>
                                    <ContextInput
                                        label="Phone"
                                        name="phone"
                                        placeholder="Enter your Phone"
                                        required
                                        large
                                    />
                                </Col>
                                <div className="col-md-12">
                                    <label className="form-label me-3">
                                        Permissions:
                                    </label>
                                    <div className="form-check form-check-inline">
                                        <ContextCheckbox
                                            name="can_view_invoices"
                                            label="View Invoices"
                                        />
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <ContextCheckbox
                                            name="can_view_reports"
                                            label="View Reports"
                                        />
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <ContextCheckbox
                                            name="can_create_users"
                                            label="Manage Users"
                                            disableFn={(formData) =>
                                                get(
                                                    formData,
                                                    "primary_role"
                                                ) === "hp_champion"
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <Row className="mb-3">
                                <Col lg={6}>
                                    <FormButtons
                                        submitLabel="Add"
                                        cancelLabel="Cancel"
                                    />
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </PageLayout>
    );
};

export default AddUser;

import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import * as Yup from "yup";
import { get } from "lodash";

import { Button } from "components";
import Form from "components/elements/Form";
import ContextInput from "components/inputs/ContextInput";
import ContextSelect from "components/contextInputs/Select";
import ContextCheckbox from "components/contextInputs/Checkbox";
import PhoneInput from "components/inputs/PhoneInput";

const HealthplanUserForm = ({
    editUserData: {
        primary_role,
        job_title,
        first_name,
        last_name,
        email,
        phone_primary: phone,
        abilities = [],
    },
    label,
    onSubmit,
    updateLoading,
}) => {
    const [defaultData] = useState({
        primary_role,
        job_title,
        first_name,
        last_name,
        email,
        phone,
        can_view_invoices: abilities?.indexOf("view-invoices") !== -1,
        can_view_reports: abilities?.indexOf("view-reports") !== -1,
        can_create_users: abilities?.indexOf("create-users") !== -1,
    });

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
    return (
        <Form
            autocomplete={false}
            defaultData={defaultData}
            validation={validation}
            onSubmit={(values) => {
                onSubmit(values, "healthplan");
            }}
        >
            <Row>
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
                    <PhoneInput name="phone" label="Phone" required large />
                </Col>
                <Col md={12}>
                    <label className="form-label me-3">Permissions:</label>
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
                                get(formData, "primary_role") === "hp_champion"
                            }
                        />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col md={3} className="mt-3">
                    <Button
                        type="submit"
                        label={label}
                        variant="primary"
                        disabled={updateLoading}
                        block
                    />
                </Col>
            </Row>
        </Form>
    );
};

export default HealthplanUserForm;

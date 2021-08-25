import React, { useEffect, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { get, isEmpty } from "lodash";
import * as Yup from "yup";

import BroadcastAlert from "components/elements/BroadcastAlert";
import PageTitle from "components/PageTitle";
import ContextSelect from "components/contextInputs/Select";
import ContextInput from "components/inputs/ContextInput";
import ContextCheckbox from "components/contextInputs/Checkbox";
import FormButtons from "components/contextInputs/FormButtons";
import Form from "components/elements/Form";
import PageAlert from "components/elements/PageAlert";

import PageLayout from "layouts/PageLayout";

import useApiCall from "hooks/useApiCall";

import "styles/home.scss";

const EditUser = () => {
    // get id from url
    const { id } = useParams();
    const [user, setUser] = useState({});
    const [{ userUpdated }, setUserUpdated] = useState({ userUpdated: false });
    // history for go back
    const history = useHistory();
    const [{ data: userData }, fetchUser] = useApiCall({
        method: "get",
        url: `user/${id}`,
    });

    // fetch the user data
    useEffect(() => {
        const fetch = async () => {
            try {
                await fetchUser();
            } catch (e) {
                console.log("User fetch error:", e);
            }
        };
        let isMounted = true;
        // fetch the user
        if (isMounted) {
            fetch();
        }
        // cleanup
        return () => {
            isMounted = false;
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!isEmpty(userData)) {
            setUser({
                ...userData,
                phone: userData.phone_primary,
                can_view_invoices:
                    userData?.abilities?.indexOf("view-invoices") !== -1
                        ? true
                        : false,
                can_view_reports:
                    userData?.abilities?.indexOf("view-reports") !== -1
                        ? true
                        : false,
                can_create_users:
                    userData?.abilities?.indexOf("create-users") !== -1
                        ? true
                        : false,
            });
        }
    }, [userData]);

    // form handling
    const [{ loading, error: formError }, fireSubmit] = useApiCall({
        method: "put",
        url: `user/${id}`,
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
                .required("Email is required")
                .email("Please enter a valid email"),
        },
        phone: {
            yupSchema: Yup.string().required("Phone is required"),
        },
    };

    const onCancel = () => {
        history.goBack();
    };

    const onSubmit = async (formData) => {
        setUserUpdated({ userUpdated: false });
        if (loading) {
            return false;
        }

        try {
            const result = await fireSubmit({ params: formData });

            if (result) {
                setUserUpdated({ userUpdated: true });
            }
        } catch (e) {
            console.log("User create error:", e);
        }
    };

    return (
        <PageLayout>
            <Container fluid>
                <BroadcastAlert />
                <PageTitle title="Edit User" onBack={() => history.goBack()} />
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
                        {userUpdated ? (
                            <PageAlert
                                className="mt-3"
                                variant="success"
                                timeout={5000}
                                dismissible
                            >
                                User Successfully Updated.
                            </PageAlert>
                        ) : null}
                        {!isEmpty(user) ? (
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
                                <div className="form-row mb-3">
                                    <Col lg={6}>
                                        <FormButtons
                                            submitLabel="Save"
                                            cancelLabel="Cancel"
                                            onCancel={onCancel}
                                        />
                                    </Col>
                                </div>
                            </Form>
                        ) : null}
                    </Col>
                </Row>
            </Container>
        </PageLayout>
    );
};

export default EditUser;

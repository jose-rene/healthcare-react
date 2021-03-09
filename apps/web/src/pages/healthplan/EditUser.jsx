import React, { useEffect, useState } from "react";
import { Form, Row } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "../../components/inputs/Button";
import BroadcastAlert from "../../components/elements/BroadcastAlert";
import PageLayout from "../../layouts/PageLayout";
import "../../styles/home.scss";
import Select from "../../components/inputs/Select";
import InputText from "../../components/inputs/InputText";
import useApiCall from "../../hooks/useApiCall";
import PageAlert from "../../components/elements/PageAlert";
/* eslint-disable jsx-a11y/label-has-associated-control */

const EditUser = () => {
    // get id from url
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [{ userUpdated }, setUserUpdated] = useState({ userUpdated: false });
    console.log("id => ", id, user);
    const history = useHistory();
    const [
        { data: userData, loading: userLoading, error: userError },
        fetchUser,
    ] = useApiCall({
        method: "get",
        url: `user/${id}`,
    });
    // fetch the user data
    useEffect(() => {
        const fetch = async () => {
            try {
                const result = await fetchUser();
                setUser(result);
                // console.log(result);
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
    }, []);
    const [{ data, loading, error: formError }, fireSubmit] = useApiCall({
        method: "put",
        url: `user/${id}`,
    });
    console.log(formError);
    const { register, handleSubmit, reset, errors } = useForm();
    const onCancel = () => {
        history.goBack();
    };
    const onSubmit = async (formData) => {
        if (loading) {
            return false;
        }
        try {
            const result = await fireSubmit({ params: formData });
            // console.log("result-> ", result);
            setUserUpdated({ userUpdated: true });
            // reset();
        } catch (e) {
            console.log("User create error:", e);
        }
    };
    // console.log(user);
    return (
        <PageLayout>
            <BroadcastAlert />
            <div className="content-box">
                <Row>
                    <div className="col-lg-12">
                        <h1 className="box-title">
                            <Button
                                className="py-2 mr-3"
                                variant="warn"
                                icon="chevron-left"
                                iconSize="sm"
                                onClick={() => history.goBack()}
                            >
                                Back
                            </Button>
                            Edit User
                        </h1>
                    </div>
                    <div className="col-lg-6">
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
                        {user ? (
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <div className="form-row mb-3">
                                    <div className="col-6">
                                        <Select
                                            name="primary_role"
                                            label="User Type"
                                            defaultValue={user.primary_role}
                                            options={[
                                                {
                                                    id: "hp_user",
                                                    title: "Health Plan User",
                                                    val: "hp_user",
                                                },
                                                {
                                                    id: "hp_champion",
                                                    title:
                                                        "Health Plan Finance",
                                                    val: "hp_finance",
                                                },
                                                {
                                                    id: "hp_champion",
                                                    title:
                                                        "Health Plan Champion",
                                                    val: "hp_champion",
                                                },
                                                {
                                                    id: "hp_champion",
                                                    title:
                                                        "Health Plan Manager",
                                                    val: "hp_manager",
                                                },
                                            ]}
                                            errors={errors}
                                            ref={register({
                                                required:
                                                    "User Type is required",
                                            })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <InputText
                                            name="first_name"
                                            label="First Name"
                                            errors={errors}
                                            defaultValue={user.first_name}
                                            ref={register({
                                                required:
                                                    "First Name is required",
                                                minLength: {
                                                    value: 1,
                                                    message:
                                                        "First name must be at least 1 character",
                                                },
                                                maxLength: {
                                                    value: 64,
                                                    message:
                                                        "First name cannot be longer than 64 characters",
                                                },
                                            })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <InputText
                                            name="last_name"
                                            label="Last Name"
                                            errors={errors}
                                            defaultValue={user.last_name}
                                            ref={register({
                                                required:
                                                    "Last Name is required",
                                                minLength: {
                                                    value: 1,
                                                    message:
                                                        "Last name must be at least 1 character",
                                                },
                                                maxLength: {
                                                    value: 64,
                                                    message:
                                                        "Last name cannot be longer than 64 characters",
                                                },
                                            })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <InputText
                                            name="job_title"
                                            label="Job Title"
                                            errors={errors}
                                            defaultValue={user.job_title}
                                            ref={register({
                                                required:
                                                    "Job Title is required",
                                                minLength: {
                                                    value: 2,
                                                    message:
                                                        "Job Title must be at least 2 character",
                                                },
                                                maxLength: {
                                                    value: 64,
                                                    message:
                                                        "Job Title name cannot be longer than 64 characters",
                                                },
                                            })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <InputText
                                            name="email"
                                            label="Email"
                                            type="email"
                                            defaultValue={user.email}
                                            errors={errors}
                                            ref={register({
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message:
                                                        "Please enter a valid email address",
                                                },
                                            })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <InputText
                                            name="phone"
                                            label="Phone"
                                            errors={errors}
                                            defaultValue={user.phone_primary}
                                            ref={register({
                                                required: "Phone is required",
                                            })}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label mr-3">
                                            Permissions:
                                        </label>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="can_view_invoices"
                                                id="can_view_invoices"
                                                defaultChecked={userData.abilities.includes(
                                                    "view-invoices"
                                                )}
                                                ref={register()}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="can_view_invoices"
                                            >
                                                View Invoices
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="can_view_reports"
                                                id="can_view_reports"
                                                defaultChecked={userData.abilities.includes(
                                                    "view-reports"
                                                )}
                                                ref={register()}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="can_view_reports"
                                            >
                                                View Reports
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="can_create_users"
                                                id="can_create_users"
                                                defaultChecked={userData.abilities.includes(
                                                    "create-users"
                                                )}
                                                ref={register()}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="can_create_users"
                                            >
                                                Manage Users
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row mb-3">
                                    <div className="col-12">
                                        <Button
                                            className="py-2"
                                            variant="secondary"
                                            onClick={onCancel}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="ml-3 py-2"
                                            type="Submit"
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        ) : null}
                    </div>
                    <div className="col-lg-6" />
                </Row>
            </div>
        </PageLayout>
    );
};

export default EditUser;

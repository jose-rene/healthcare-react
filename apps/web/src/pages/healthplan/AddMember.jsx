import React, { useEffect, useMemo } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import _ from "lodash";
import Button from "../../components/inputs/Button";
import BroadcastAlert from "../../components/elements/BroadcastAlert";
import PageLayout from "../../layouts/PageLayout";
import "../../styles/home.scss";
import Select from "../../components/inputs/Select";
import InputText from "../../components/inputs/InputText";
import FormButtons from "../../components/elements/FormButtons";
import useApiCall from "../../hooks/useApiCall";
/* eslint-disable jsx-a11y/label-has-associated-control */

const AddMember = () => {
    const [{ data: plans }, plansRequest] = useApiCall({
        url: "plan/plans",
    });

    const [{ data: lobs }, lobsRequest] = useApiCall({
        url: "plan/lobs",
    });

    useEffect(() => {
        plansRequest();
        lobsRequest();
    }, []);

    const planOptions = useMemo(() => {
        if (_.isEmpty(plans)) {
            return [];
        }

        return plans.map(({ id, plan }) => {
            return { id, title: plan, val: plan };
        });
    }, [plans]);

    const lobOptions = useMemo(() => {
        if (_.isEmpty(lobs)) {
            return [];
        }

        return lobs.map(({ id, plan }) => {
            return { id, title: plan, val: plan };
        });
    }, [lobs]);

    const { register, handleSubmit, errors, reset } = useForm();

    const onSubmit = (formData) => {
        console.log(formData);
    };

    const onCancel = () => {
        reset();
    };

    return (
        <PageLayout>
            <BroadcastAlert />
            <div className="content-box">
                <h1 className="box-title" style={{ marginBottom: "0px" }}>
                    New Member Info
                </h1>
                <p className="box-legenda">
                    Please enter the following information before proceeding
                    with the new request. Fields marked with * are required
                </p>

                <div className="white-box">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-row">
                            <div className="col-md-6">
                                <Select
                                    name="plan"
                                    label="Plan"
                                    options={planOptions}
                                    errors={errors}
                                />
                            </div>

                            <div className="col-md-6"></div>

                            <div className="col-md-12">
                                <h1
                                    className="box-outside-title title-second"
                                    style={{ marginBottom: "32px" }}
                                >
                                    Member ID
                                </h1>
                            </div>

                            <div className="col-md-6">
                                <InputText
                                    name="member_id"
                                    label="Member ID"
                                    errors={errors}
                                />
                            </div>

                            <div className="col-md-6">
                                <Select
                                    name="line_of_business"
                                    label="Line of Business*"
                                    options={lobOptions}
                                    errors={errors}
                                    ref={register({
                                        required:
                                            "Line of Business is required",
                                    })}
                                />
                            </div>

                            <div className="col-md-12">
                                <h1
                                    className="box-outside-title title-second"
                                    style={{ marginBottom: "32px" }}
                                >
                                    Basic Info
                                </h1>
                            </div>

                            <div className="col-md-6">
                                <Select
                                    name="title"
                                    label="Title"
                                    options={[
                                        {
                                            id: "select_option",
                                            title: "Select option",
                                            val: "select-option",
                                        },
                                    ]}
                                    errors={errors}
                                />
                            </div>

                            <div className="col-md-6">
                                <InputText
                                    name="date_of_birth"
                                    label="Date of Birth"
                                    type="date"
                                    errors={errors}
                                />
                            </div>

                            <div className="col-md-6">
                                <InputText
                                    name="first_name"
                                    label="First Name"
                                    errors={errors}
                                />
                            </div>

                            <div className="col-md-6">
                                <InputText
                                    name="last_name"
                                    label="Last Name"
                                    errors={errors}
                                />
                            </div>

                            <div className="col-md-6">
                                <Select
                                    name="gender"
                                    label="Gender"
                                    options={[
                                        {
                                            id: "male",
                                            title: "Male",
                                            val: "male",
                                        },
                                        {
                                            id: "female",
                                            title: "Female",
                                            val: "female",
                                        },
                                    ]}
                                    errors={errors}
                                />
                            </div>

                            <div className="col-md-6">
                                <Select
                                    name="language"
                                    label="Language"
                                    options={[
                                        {
                                            id: "english",
                                            title: "English",
                                            val: "english",
                                        },
                                        {
                                            id: "spanish",
                                            title: "Spanish",
                                            val: "spanish",
                                        },
                                    ]}
                                    errors={errors}
                                />
                            </div>

                            <div className="col-md-12">
                                <InputText
                                    name="address_1"
                                    label="Address 1"
                                    errors={errors}
                                />
                            </div>

                            <div className="col-md-12">
                                <InputText
                                    name="address_2"
                                    label="Address 2"
                                    errors={errors}
                                />
                            </div>

                            <div className="col-md-12">
                                <div className="form-row">
                                    <div className="col-md-6">
                                        <InputText
                                            name="zip"
                                            label="Zip"
                                            errors={errors}
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <Button
                                            className="btn btn-block btn-zip"
                                            type="Submit"
                                        >
                                            Lookup Zip
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <InputText
                                    name="city"
                                    label="City"
                                    errors={errors}
                                />
                            </div>

                            <div className="col-md-6">
                                <Select
                                    name="state"
                                    label="State"
                                    options={[
                                        {
                                            id: "select_option",
                                            title: "Select option",
                                            val: "select-option",
                                        },
                                    ]}
                                    errors={errors}
                                />
                            </div>

                            <div className="col-md-12">
                                <h1
                                    className="box-outside-title title-second"
                                    style={{ marginBottom: "32px" }}
                                >
                                    Contact Methods
                                </h1>
                            </div>

                            <div className="col-md-6">
                                <Select
                                    name="type"
                                    label="Type"
                                    options={[
                                        {
                                            id: "select_option",
                                            title: "Select option",
                                            val: "select-option",
                                        },
                                    ]}
                                    errors={errors}
                                />
                            </div>

                            <div className="col-md-6">
                                <InputText
                                    name="phone_email"
                                    label="Phone/Email"
                                    errors={errors}
                                />
                            </div>

                            <div className="col-md-12 mb-5">
                                <Button
                                    className="btn btn-block btn-add-method"
                                    type="Submit"
                                >
                                    + Add new contact method
                                </Button>
                            </div>

                            <div className="col-md-12">
                                <FormButtons
                                    submitLabel="Create New Request"
                                    onCancel={onCancel}
                                />
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </PageLayout>
    );
};

export default AddMember;

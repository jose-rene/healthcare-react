import React, { useState, useEffect, useMemo } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { isEmpty } from "lodash";
import BroadcastAlert from "../../components/elements/BroadcastAlert";
import PageAlert from "../../components/elements/PageAlert";
import AddressForm from "../../components/elements/AddressForm";
import PageLayout from "../../layouts/PageLayout";
import Select from "../../components/inputs/Select";
import InputText from "../../components/inputs/InputText";
import FormButtons from "../../components/elements/FormButtons";
import ContactMethods from "../../components/elements/ContactMethods";
import Icon from "../../components/elements/Icon";
import useApiCall from "../../hooks/useApiCall";
import titles from "../../config/Titles.json";

import "../../styles/home.scss";
/* eslint-disable jsx-a11y/label-has-associated-control */

const AddMember = (props) => {
    const { first_name = "", last_name = "", dob = "" } =
        props.history.location?.state || {};

    const [
        { data: payerProfile, loading: pageLoading },
        payerProfileRequest,
    ] = useApiCall({
        url: "payer/profile",
    });

    const [{ data, loading, error: formError }, fireSubmit] = useApiCall({
        method: "post",
        url: "member",
    });

    useEffect(() => {
        if (!isEmpty(data)) {
            props.history.push(`/member/${data.id}/request/add`);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        payerProfileRequest();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const planOptions = useMemo(() => {
        if (isEmpty(payerProfile) || !payerProfile.payers.length) {
            return [];
        }

        return payerProfile.payers.map(({ id, company_name }) => {
            return { id, title: company_name, val: id };
        });
    }, [payerProfile]);

    const lobOptions = useMemo(() => {
        if (isEmpty(payerProfile) || !payerProfile.lines_of_business.length) {
            return [];
        }

        return payerProfile.lines_of_business.map(({ id, name }) => {
            return { id, title: name, val: id };
        });
    }, [payerProfile]);

    const memberNumberTypesOptions = useMemo(() => {
        if (isEmpty(payerProfile) || !payerProfile.member_number_types.length) {
            return [];
        }
        return payerProfile.member_number_types.map(({ id, title }) => {
            return { id, title, val: id };
        });
    }, [payerProfile]);

    const languageOptions = useMemo(() => {
        if (!payerProfile?.languages?.length) {
            return [];
        }

        return payerProfile.languages.map(({ id, name }) => {
            return { id, title: name, val: id };
        });
    }, [payerProfile]);

    const titlesOptions = useMemo(() => {
        if (isEmpty(titles)) {
            return [];
        }

        const result = [{ id: "", title: "", val: "" }];
        for (const [key, value] of Object.entries(titles)) {
            result.push({
                id: value,
                title: value,
                val: key,
            });
        }

        return result;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [titles]);

    const { register, handleSubmit, errors, reset } = useForm();

    const [member, setMember] = useState(null);
    const [contactMethods, setContactMethods] = useState([
        { type: "type", phone_email: "phone_email" },
    ]);
    const [contacts, setContacts] = useState({});
    const [addressFormValue, setAddressFormValue] = useState({});

    const onSubmit = async (formData) => {
        if (loading) {
            return false;
        }
        const sendContactsData = [];
        contactMethods.forEach((v) => {
            sendContactsData.push({
                type: contacts[v.type],
                value: contacts[v.phone_email],
            });
        });
        const formSendData = {
            ...formData,
            contacts: sendContactsData,
            ...addressFormValue,
        };

        try {
            const result = await fireSubmit({ params: formSendData });
            setMember(result);
        } catch (e) {
            console.log("Member create error:", e);
        }
    };

    const onCancel = () => {
        reset();
    };

    const setContactMethodsValue = ({ target: { name, value } }) => {
        setContacts({ ...contacts, [name]: value });
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

                {pageLoading ? (
                    <div className="d-flex justify-content-center">
                        <Icon icon="spinner" />
                    </div>
                ) : (
                    <div className="white-box">
                        {member ? (
                            <PageAlert
                                className="mt-3"
                                variant="success"
                                timeout={5000}
                                dismissible
                            >
                                Member Successfully Added.
                            </PageAlert>
                        ) : null}
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-row">
                                {planOptions.length > 0 ? (
                                    <>
                                        <div className="col-md-6">
                                            <Select
                                                name="plan"
                                                label="Plan*"
                                                options={planOptions}
                                                errors={errors}
                                                ref={register({
                                                    required:
                                                        "Plan is required",
                                                })}
                                            />
                                        </div>

                                        <div className="col-md-6" />
                                    </>
                                ) : (
                                    <InputText
                                        hidden
                                        name="plan"
                                        value={payerProfile.id || ""}
                                        readOnly
                                    />
                                )}

                                <div className="col-md-12">
                                    <h1
                                        className="box-outside-title title-second"
                                        style={{ marginBottom: "32px" }}
                                    >
                                        Member Identification Info
                                    </h1>
                                </div>

                                <div className="col-md-6">
                                    <InputText
                                        name="member_number"
                                        label="Member ID*"
                                        errors={errors}
                                        ref={register({
                                            required: "Member ID is required",
                                        })}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <Select
                                        name="member_number_type"
                                        label="Member ID Type*"
                                        options={memberNumberTypesOptions}
                                        errors={errors}
                                        ref={register({
                                            required:
                                                "Member ID Type is required",
                                        })}
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
                                        label="Title*"
                                        options={titlesOptions}
                                        errors={errors}
                                        ref={register({
                                            required: "Title is required",
                                        })}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <InputText
                                        name="dob"
                                        label="Date of Birth*"
                                        defaultValue={dob}
                                        type="date"
                                        errors={errors}
                                        ref={register({
                                            required:
                                                "Date of Birth is required",
                                        })}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <InputText
                                        name="first_name"
                                        defaultValue={first_name}
                                        label="First Name*"
                                        errors={errors}
                                        ref={register({
                                            required: "First Name is required",
                                        })}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <InputText
                                        name="last_name"
                                        label="Last Name*"
                                        defaultValue={last_name}
                                        errors={errors}
                                        ref={register({
                                            required: "Last Name is required",
                                        })}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <Select
                                        name="gender"
                                        label="Gender*"
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
                                        ref={register({
                                            required: "Gender is required",
                                        })}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <Select
                                        name="language"
                                        label="Language*"
                                        options={languageOptions}
                                        defaultValue="6" // 6 is English
                                        errors={errors}
                                        ref={register({
                                            required: "Language is required",
                                        })}
                                    />
                                </div>

                                <AddressForm
                                    setAddressFormValue={setAddressFormValue}
                                />

                                <div className="col-md-12">
                                    <h1
                                        className="box-outside-title title-second"
                                        style={{ marginBottom: "32px" }}
                                    >
                                        Contact Methods
                                    </h1>
                                </div>

                                <ContactMethods
                                    contactMethods={contactMethods}
                                    setContactMethods={setContactMethods}
                                    setContactMethodsValue={
                                        setContactMethodsValue
                                    }
                                />

                                <div className="col-md-12">
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

                                <div className="col-md-12">
                                    <FormButtons
                                        submitLabel="Create New Request"
                                        onCancel={onCancel}
                                    />
                                </div>
                            </div>
                        </Form>
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default AddMember;

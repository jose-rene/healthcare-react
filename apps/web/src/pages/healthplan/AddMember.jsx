import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { isEmpty } from "lodash";
import * as Yup from "yup";

import PageLayout from "layouts/PageLayout";

import Form from "components/elements/Form";
import BroadcastAlert from "components/elements/BroadcastAlert";
import ContextInput from "components/inputs/ContextInput";
import ContextSelect from "components/contextInputs/Select";
import PageAlert from "components/elements/PageAlert";
import AddressForm from "components/elements/AddressForm";
import FormButtons from "components/contextInputs/FormButtons";
import ContactMethods from "components/elements/ContactMethods";
import Icon from "components/elements/Icon";
import PageTitle from "components/PageTitle";

import useApiCall from "hooks/useApiCall";

import titles from "config/Titles.json";

import "styles/home.scss";

const AddMember = (props) => {
    const {
        first_name = "",
        last_name = "",
        dob = "",
    } = props.history.location?.state || {};

    const [member, setMember] = useState(null);
    const [initialData, setInitialData] = useState(null);
    const [plan, setPlan] = useState(null);
    const [contactMethods, setContactMethods] = useState([
        { type: "type", phone_email: "phone_email" },
    ]);

    const [{ data: payerProfile, loading: pageLoading }, payerProfileRequest] =
        useApiCall({
            url: "payer/profile",
        });

    const [{ data, loading, error: formError }, fireSubmit] = useApiCall({
        method: "post",
        url: "member",
    });

    const [validation, setValidation] = useState({
        plan: {
            yupSchema: Yup.string().required("Plan is required"),
        },
        member_number: {
            yupSchema: Yup.string().required("Member ID is required"),
        },
        member_number_type: {
            yupSchema: Yup.string().required("Member ID Type is required"),
        },
        line_of_business: {
            yupSchema: Yup.string().required("Line of Business is required"),
        },
        title: {
            yupSchema: Yup.string().required("Title is required"),
        },
        dob: {
            yupSchema: Yup.string().required("Date of Birth is required"),
        },
        first_name: {
            yupSchema: Yup.string().required("First Name of Birth is required"),
        },
        last_name: {
            yupSchema: Yup.string().required("Last Name of Birth is required"),
        },
        gender: {
            yupSchema: Yup.string().required("Gender is required"),
        },
        language: {
            yupSchema: Yup.string().required("Language is required"),
        },
        address_1: {
            yupSchema: Yup.string().required("Address 1 is required"),
        },
        city: {
            yupSchema: Yup.string().required("City is required"),
        },
        state: {
            yupSchema: Yup.string().required("State is required"),
        },
        postal_code: {
            yupSchema: Yup.string().required("Postal Code is required"),
        },
    });

    useEffect(() => {
        // set initial plan
        setPlan(payerProfile?.payers?.length ? payerProfile?.payers[0] : null);
    }, [payerProfile]);

    const planOptions = useMemo(() => {
        if (!payerProfile?.payers?.length) {
            return [];
        }

        return payerProfile.payers.map(
            ({ id, company_name, lines_of_business }) => {
                return {
                    id,
                    title: company_name,
                    val: id,
                    lines_of_business,
                };
            }
        );
    }, [payerProfile]);

    const updatePlan = (e) => {
        const newPlan = planOptions.find((item) => item.id === e.target.value);
        setPlan(newPlan);
    };

    const lobOptions = useMemo(() => {
        if (!plan?.lines_of_business?.length) {
            return [];
        }

        return plan.lines_of_business.map(({ id, name }) => {
            return { id, title: name, val: id };
        });
    }, [plan]);

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
    //
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

    useEffect(() => {
        let contactMethodsValidation = {};

        contactMethods.forEach(({ type, phone_email }, index) => {
            contactMethodsValidation = {
                ...contactMethodsValidation,
                [type]: {
                    yupSchema: Yup.string().required("Type is required"),
                },
                [phone_email]: {
                    yupSchema: Yup.string().required("Phone/Email is required"),
                },
            };
        });

        setValidation({ ...validation, ...contactMethodsValidation });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contactMethods]);

    useEffect(() => {
        setInitialData({
            first_name,
            last_name,
            dob,
            language: "6", // 6 is English
            plan: planOptions[0]?.val,
            member_number_type: memberNumberTypesOptions[0]?.val,
            line_of_business: lobOptions[0]?.val,
            title: titlesOptions[0]?.val,
            gender: "male",
        });
    }, [
        first_name,
        last_name,
        dob,
        planOptions,
        lobOptions,
        memberNumberTypesOptions,
        titlesOptions,
    ]);

    useEffect(() => {
        if (data?.id) {
            props.history.push(`/member/${data.id}/request/add`);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        payerProfileRequest();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = async (formData) => {
        if (loading) {
            return false;
        }

        const sendContactsData = [];
        contactMethods.forEach((v) => {
            sendContactsData.push({
                type: formData[v.type],
                value: formData[v.phone_email],
            });
        });
        const formSendData = {
            ...formData,
            contacts: sendContactsData,
        };

        try {
            const result = await fireSubmit({ params: formSendData });
            setMember(result);
        } catch (e) {
            console.log("Member create error:", e);
        }
    };

    console.log("plan", plan);

    return (
        <PageLayout>
            <Container fluid>
                <BroadcastAlert />
                <PageTitle title="New Member Info" hideBack />
                <p className="box-legenda">
                    Please enter the following information before proceeding
                    with the new request. Fields marked with * are required
                </p>

                {pageLoading ? (
                    <div className="d-flex justify-content-center">
                        <Icon icon="spinner" />
                    </div>
                ) : (
                    <>
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
                        <Form
                            autocomplete={false}
                            defaultData={member || initialData}
                            validation={validation}
                            onSubmit={onSubmit}
                        >
                            <Row xl={12}>
                                <>
                                    {planOptions.length > 0 ? (
                                        <Col md={6}>
                                            <ContextSelect
                                                name="plan"
                                                label="Plan*"
                                                value={plan?.id ?? ""}
                                                options={planOptions}
                                                required
                                                large
                                                onChange={updatePlan}
                                            />
                                        </Col>
                                    ) : (
                                        <ContextInput
                                            hidden
                                            name="plan"
                                            label="Plan"
                                            value={payerProfile.id || ""}
                                            readOnly
                                        />
                                    )}
                                    <Col md={6} />
                                </>

                                <Col md={12}>
                                    <h1
                                        className="box-outside-title title-second"
                                        style={{ marginBottom: "32px" }}
                                    >
                                        Member Identification Info
                                    </h1>
                                </Col>

                                <Col md={6}>
                                    <ContextInput
                                        name="member_number"
                                        label="Member ID*"
                                    />
                                </Col>

                                <Col md={6}>
                                    <ContextSelect
                                        name="member_number_type"
                                        label="Member ID Type*"
                                        options={memberNumberTypesOptions}
                                    />
                                </Col>

                                <Col md={6}>
                                    <ContextSelect
                                        name="line_of_business"
                                        label="Line of Business"
                                        options={lobOptions}
                                    />
                                </Col>

                                <Col md={12}>
                                    <h1
                                        className="box-outside-title title-second"
                                        style={{ marginBottom: "32px" }}
                                    >
                                        Basic Info
                                    </h1>
                                </Col>

                                <Col md={6}>
                                    <ContextSelect
                                        name="title"
                                        label="Title*"
                                        options={titlesOptions}
                                    />
                                </Col>

                                <Col md={6}>
                                    <ContextInput
                                        name="dob"
                                        label="Date of Birth*"
                                        type="date"
                                    />
                                </Col>

                                <Col md={6}>
                                    <ContextInput
                                        name="first_name"
                                        label="First Name*"
                                    />
                                </Col>

                                <Col md={6}>
                                    <ContextInput
                                        name="last_name"
                                        label="Last Name"
                                    />
                                </Col>

                                <Col md={6}>
                                    <ContextSelect
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
                                    />
                                </Col>

                                <Col md={6}>
                                    <ContextSelect
                                        name="language"
                                        label="Language*"
                                        options={languageOptions}
                                    />
                                </Col>

                                <Col md={12}>
                                    <AddressForm />
                                </Col>

                                <Col md={12}>
                                    <h1
                                        className="box-outside-title title-second"
                                        style={{ marginBottom: "32px" }}
                                    >
                                        Contact Methods
                                    </h1>
                                </Col>

                                <Col md={12}>
                                    <ContactMethods
                                        contactMethods={contactMethods}
                                        setContactMethods={setContactMethods}
                                    />
                                </Col>

                                <Col md={12}>
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
                                </Col>

                                <Col md={12}>
                                    <FormButtons submitLabel="Create New Request" />
                                </Col>
                            </Row>
                        </Form>
                    </>
                )}
            </Container>
        </PageLayout>
    );
};

export default AddMember;

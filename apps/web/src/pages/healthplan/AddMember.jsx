import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Container, Alert } from "react-bootstrap";
import { isEmpty } from "lodash";
import * as Yup from "yup";

import PageLayout from "layouts/PageLayout";

import Form from "components/elements/Form";
import ContextInput from "components/inputs/ContextInput";
import ContextSelect from "components/contextInputs/Select";
import PageAlert from "components/elements/PageAlert";
import AddressForm from "components/elements/AddressForm";
import FormButtons from "components/contextInputs/FormButtons";
import ContactMethods from "components/elements/ContactMethods";
import PageTitle from "components/PageTitle";

import useApiCall from "hooks/useApiCall";

import titles from "config/Titles.json";
import FapIcon from "components/elements/FapIcon";
import MemberInfoForm from "components/elements/MemberInfoForm";

const AddMember = (props) => {
    const {
        first_name = "",
        last_name = "",
        dob = "",
    } = props.history.location?.state || {};

    const [member, setMember] = useState(null);
    const [initialData, setInitialData] = useState(null);

    const [{ data: payerProfile, loading: pageLoading }, payerProfileRequest] =
        useApiCall({
            url: "payer/profile",
        });

    const [{ data, loading, error: formError }, fireSubmit] = useApiCall({
        method: "post",
        url: "member",
    });

    const [validation] = useState({
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
        setInitialData({
            first_name,
            last_name,
            dob,
            language_id: 6, // 6 is English
            plan: "",
            member_number_type: "",
            line_of_business: "",
            title: titlesOptions[0]?.val,
            gender: "male",
        });
    }, [first_name, last_name, dob, titlesOptions]);

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

        try {
            const result = await fireSubmit({ params: formData });
            setMember(result);
        } catch (e) {
            console.log("Member create error:", e);
        }
    };

    const onCancel = () => {
        props.history.push("/healthplan/start-request");
    };

    return (
        <PageLayout>
            <Container fluid>
                <Row className="justify-content-lg-center">
                    <Col xl={10}>
                        <PageTitle title="New Member Info" hideBack />
                        <Alert variant="success" className="px-4 py-3 mb-4">
                            Please enter the following information before
                            proceeding with the new request. Fields marked with
                            * are required.
                        </Alert>
                    </Col>
                </Row>
                <Row className="justify-content-lg-center">
                    <Col xl={10}>
                        {pageLoading ? (
                            <div className="text-center">
                                <FapIcon icon="spinner" size="2x" />
                                <span className="fs-3 ms-2 align-middle">
                                    Loading...
                                </span>
                            </div>
                        ) : (
                            <>
                                {member && (
                                    <PageAlert
                                        className="mt-3"
                                        variant="success"
                                        timeout={5000}
                                        dismissible
                                    >
                                        Member Successfully Added.
                                    </PageAlert>
                                )}
                                <Form
                                    autocomplete={false}
                                    defaultData={member || initialData}
                                    validation={validation}
                                    onSubmit={onSubmit}
                                    className="row"
                                >
                                    <MemberInfoForm payer={payerProfile} />

                                    <Col md={12}>
                                        <h1 className="box-outside-title title-second my-4">
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
                                            className="w-100"
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
                                            name="language_id"
                                            label="Language*"
                                            options={languageOptions}
                                        />
                                    </Col>

                                    <Col md={12}>
                                        <AddressForm />
                                    </Col>

                                    <Col md={12}>
                                        <h1 className="box-outside-title title-second my-4">
                                            Contact Methods
                                        </h1>
                                    </Col>

                                    <Col md={12} className="mb-3">
                                        <ContactMethods />
                                    </Col>

                                    <Col md={12}>
                                        {formError && (
                                            <PageAlert
                                                className="mt-3"
                                                variant="warning"
                                                timeout={5000}
                                                dismissible
                                            >
                                                Error: {formError}
                                            </PageAlert>
                                        )}
                                    </Col>

                                    <Col md={6}>
                                        <FormButtons
                                            submitLabel="Create New Request"
                                            cancelLabel="Cancel"
                                            onCancel={onCancel}
                                        />
                                    </Col>
                                </Form>
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </PageLayout>
    );
};

export default AddMember;

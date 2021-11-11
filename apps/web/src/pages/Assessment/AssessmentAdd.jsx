import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import * as Yup from "yup";

import PageLayout from "layouts/PageLayout";

import { Button } from "components";
import PageTitle from "components/PageTitle";
import ContextInput from "components/inputs/ContextInput";
import Form from "components/elements/Form";
import PageAlert from "components/elements/PageAlert";
import AssessmentAddForm from "components/assessment/AssessmentAddForm";

import useApiCall from "hooks/useApiCall";
import useToast from "hooks/useToast";

const AssessmentAdd = (props) => {
    const { success: successMessage } = useToast();
    const { id: assessmentId } = useParams();

    const [
        {
            data: { data = [] },
        },
        fireGetForms,
    ] = useApiCall({
        url: "/form",
    });

    const [{ loading, error }, postForms] = useApiCall({
        method: "post",
        url: "/admin/assessments",
    });

    const [{ data: editAssessment }, fireGetAssessment] = useApiCall({
        url: `/admin/assessments/${assessmentId}`,
    });

    const [{ loading: editLoading, error: editError }, updateForms] =
        useApiCall({
            method: "put",
            url: `/admin/assessments/${assessmentId}`,
        });

    const validation = {
        name: {
            yupSchema: Yup.string().required("Name is required"),
        },
        description: {
            yupSchema: Yup.string().required("Description is required"),
        },
    };

    const [defaultData, setDefaultData] = useState({});

    useEffect(() => {
        fireGetForms();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fireGetAssessment();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assessmentId]);

    useEffect(() => {
        setDefaultData({
            id: editAssessment?.id,
            name: editAssessment?.name,
            description: editAssessment?.description,
            forms: editAssessment?.sections,
        });
    }, [editAssessment]);

    const formOptions = useMemo(() => {
        if (!data) {
            return [];
        }

        return data.map(({ id, name }) => {
            return { id, title: name, val: name };
        });
    }, [data]);

    const handleBack = () => {
        props.history.push("/admin/assessments");
    };

    const onSubmit = async (formValues) => {
        const { name, description, forms } = formValues;
        let formsParam = [];

        formsParam = forms.map(({ value = "", name = "" }, index) => {
            // map the name of the item to the id from the form data
            const selected = data.find(
                (item) => item.name === (assessmentId && !value ? name : value)
            );
            return {
                id: selected?.id ?? 0,
                position: index,
            };
        });

        let result;

        if (assessmentId) {
            result = await updateForms({
                params: { name, description, forms: formsParam },
            });
        } else {
            result = await postForms({
                params: { name, description, forms: formsParam },
            });
        }

        if (result) {
            setDefaultData({
                id: result?.id,
                name: result?.name,
                description: result?.description,
                forms: result?.sections,
            });
            successMessage(
                assessmentId
                    ? "Form successfully updated."
                    : "Form successfully added."
            );
        }
    };

    return (
        <PageLayout>
            <Container fluid>
                <Row>
                    <Col>
                        <PageTitle
                            title={
                                assessmentId
                                    ? "Edit Assessment"
                                    : "New Assessment"
                            }
                            onBack={handleBack}
                        />
                    </Col>

                    <Col md={12}>
                        {error ? (
                            <PageAlert
                                className="mt-3"
                                variant="warning"
                                timeout={5000}
                                dismissible
                            >
                                Error: {error}
                            </PageAlert>
                        ) : null}
                    </Col>

                    <Col md={12}>
                        {editError ? (
                            <PageAlert
                                className="mt-3"
                                variant="warning"
                                timeout={5000}
                                dismissible
                            >
                                Error: {editError}
                            </PageAlert>
                        ) : null}
                    </Col>
                </Row>

                <Form
                    defaultData={defaultData}
                    validation={validation}
                    onSubmit={onSubmit}
                >
                    <Row>
                        <Col md={6}>
                            <ContextInput name="name" label="Name*" />
                        </Col>
                        <Col md={9}>
                            <ContextInput
                                name="description"
                                label="Description*"
                            />
                        </Col>

                        <AssessmentAddForm formOptions={formOptions} />

                        <Col md={4} className="mt-3">
                            <Button
                                type="submit"
                                label="Save"
                                variant="primary"
                                disabled={assessmentId ? editLoading : loading}
                                block
                            />
                        </Col>
                    </Row>
                </Form>
            </Container>
        </PageLayout>
    );
};

export default AssessmentAdd;

import React, { useState, useEffect, useMemo } from "react";
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

        formsParam = forms.map(({value = "", name = ""}) => {
            // map the name of the item to the id from the form data
            const selected = data.find((item) => (item.name === value));
            return { id: selected?.id ?? 0, position: name };
        });
        const result = await postForms({
            params: { name, description, forms: formsParam },
        });

        if (result) {
            setDefaultData(result);
            successMessage("Form successfully added.");
        }
    };

    return (
        <PageLayout>
            <Container fluid>
                <Row>
                    <Col>
                        <PageTitle title="New Assessment" onBack={handleBack} />
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
                                disabled={loading}
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

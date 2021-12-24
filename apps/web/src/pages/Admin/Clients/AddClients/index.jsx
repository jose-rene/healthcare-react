import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

import PageLayout from "layouts/PageLayout";

import { Button } from "components";
import PageAlert from "components/elements/PageAlert";
import Form from "components/elements/Form";
import PageTitle from "components/PageTitle";

import useApiCall from "hooks/useApiCall";

import validate from "helpers/validate";
import AddClientForm from "./AddClientForm";

const AddClients = (props) => {
    const [{ error: formError }, postCompanyRequest] = useApiCall({
        method: "post",
        url: "admin/company",
    });

    const [validation, setValidation] = useState({
        name: {
            yupSchema: validate.string().required("Client Name is required"),
        },
        category: {
            yupSchema: validate.string().required("Client Type is required"),
        },
    });
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);
    const [defaultData, setDefaultData] = useState({});

    useEffect(() => {
        if (props.history.location.state) {
            const { categoryOptions, subCategoryOptions } =
                props.history.location.state;

            setCategoryOptions(categoryOptions);
            setSubCategoryOptions(subCategoryOptions);
        }
    }, [props.history.location.state]);

    const handleBack = () => {
        props.history.push("/admin/clients");
    };

    const handleSubmit = async (params) => {
        try {
            const result = await postCompanyRequest({ params });

            setDefaultData(result);
            props.history.push(`/admin/client/${result.id}`);
        } catch (e) {
            console.log("Client create error:", e);
        }
    };

    return (
        <PageLayout>
            <Container fluid>
                <PageTitle title="Add Client" onBack={handleBack} />

                <Row>
                    <Col md={6}>
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
                </Row>

                <Form
                    autocomplete={false}
                    defaultData={defaultData}
                    onSubmit={handleSubmit}
                    validation={validation}
                >
                    <Row>
                        <AddClientForm
                            categoryOptions={categoryOptions}
                            subCategoryOptions={subCategoryOptions}
                            validation={validation}
                            setValidation={setValidation}
                        />

                        <Col md={{ span: 6, offset: 3 }}>
                            <Button
                                type="submit"
                                label="Add"
                                variant="primary"
                                block
                            />
                        </Col>
                    </Row>
                </Form>
            </Container>
        </PageLayout>
    );
};

export default AddClients;

import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

import PageLayout from "layouts/PageLayout";

import { Button } from "components";
import PageAlert from "components/elements/PageAlert";
import Form from "components/elements/Form";
import PageTitle from "components/PageTitle";

import AddCompanyForm from "./AddCompanyForm";

import useApiCall from "hooks/useApiCall";

import validate from "helpers/validate";

const AddCompanies = (props) => {
    const [{ error: formError }, postCompanyRequest] = useApiCall({
        method: "post",
        url: "admin/company",
    });

    const [validation, setValidation] = useState({
        name: {
            yupSchema: validate.string().required("Company Name is required"),
        },
        company_type: {
            yupSchema: validate.string().required("Company Type is required"),
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
        props.history.push("/admin/companies");
    };

    const handleSubmit = async (params) => {
        try {
            const result = await postCompanyRequest({ params });

            setDefaultData(result);
            props.history.push(`/admin/company/${result.id}`);
        } catch (e) {
            console.log("Company create error:", e);
        }
    };

    return (
        <PageLayout>
            <Container fluid>
                <PageTitle title="Add Company" onBack={handleBack} />

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
                        <AddCompanyForm
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

export default AddCompanies;

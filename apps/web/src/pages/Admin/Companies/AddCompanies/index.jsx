import React, { useState, useEffect } from "react";
import PageAlert from "components/elements/PageAlert";
import AddCompanyForm from "./AddCompanyForm";
import PageLayout from "../../../../layouts/PageLayout";
import useApiCall from "../../../../hooks/useApiCall";
import Form from "../../../../components/elements/Form";
import validate from "../../../../helpers/validate";
import { Container } from "react-bootstrap";
import PageTitle from "../../../../components/PageTitle";

const AddCompanies = (props) => {
    const [{ error: formError }, postCompanyRequest] = useApiCall({
        method: "post",
        url: "admin/company",
    });

    const validation = {
        name: {
            yupSchema: validate.string().required("Company Name is required"),
        },
        payer_category: {
            yupSchema: validate.string().required("Payer Type is required"),
        },
        company_type: {
            yupSchema: validate.string().required("Company Type is required"),
        },
    };

    const [categoryOptions, setCategoryOptions] = useState([]);
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);

    useEffect(() => {
        if (props.history.location.state) {
            const {
                categoryOptions,
                subCategoryOptions,
            } = props.history.location.state;

            setCategoryOptions(categoryOptions);
            setSubCategoryOptions(subCategoryOptions);
        }
    }, [props.history.location.state]);

    const handleBack = () => {
        props.history.push("/admin/companies");
    };

    const handleSubmit = async (params) => {
        console.log("handleSubmit", { params });
        return false;
        try {
            const result = await postCompanyRequest({ params });

            props.history.push(`/admin/company/${result.id}`);
        } catch (e) {
            console.log("Company create error:", e);
        }
    };

    return (
        <PageLayout>
            <Container fluid>
                <PageTitle
                    title="Add Company"
                    onBack={handleBack}
                />

                <div className="col-md-6">
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
                </div>

                <Form onSubmit={handleSubmit} validation={validation}>
                    <AddCompanyForm
                        categoryOptions={categoryOptions}
                        subCategoryOptions={subCategoryOptions}
                    />
                </Form>
            </Container>
        </PageLayout>
    );
};

export default AddCompanies;

import React, { useEffect } from "react";
import { Col } from "react-bootstrap";

import Select from "components/contextInputs/Select";
import ContextInput from "components/inputs/ContextInput";

import { useFormContext } from "Context/FormContext";

import validate from "helpers/validate";

const AddCompanyForm = ({
    categoryOptions,
    subCategoryOptions,
    validation,
    setValidation,
}) => {
    const {
        form: { company_type = "" },
    } = useFormContext();

    useEffect(() => {
        if (company_type === "1") {
            setValidation({
                ...validation,
                payer_category: {
                    yupSchema: validate
                        .string()
                        .required("Payer Type is required"),
                },
            });
        } else {
            setValidation({
                ...validation,
                payer_category: {},
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company_type]);

    return (
        <>
            <Col md={{ span: 6, offset: 3 }}>
                <ContextInput name="name" label="Company Name" />
            </Col>
            <Col md={{ span: 6, offset: 3 }}>
                <Select
                    name="company_type"
                    label="Company Type"
                    options={categoryOptions}
                />
            </Col>
            <Col md={{ span: 6, offset: 3 }}>
                {company_type === "1" && (
                    <Select
                        name="payer_category"
                        label="Payer Type"
                        options={subCategoryOptions}
                    />
                )}
            </Col>
        </>
    );
};

export default AddCompanyForm;

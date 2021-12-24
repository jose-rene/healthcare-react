import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";

import { Button } from "components";
import Select from "components/inputs/Select";
import Checkbox from "components/inputs/Checkbox";
import Form from "components/elements/Form";
import InputText from "components/inputs/ContextInput";
import PageAlert from "components/elements/PageAlert";

import useApiCall from "hooks/useApiCall";

import validate from "helpers/validate";

const ClientDetailForm = ({
    company_id,
    data,
    memberIdTypesOptions,
    payerCategoryOptions,
    memberIdTypesValue,
}) => {
    const [{ error: companyInfoError }, companyInfoUpdateRequest] = useApiCall({
        method: "put",
        url: `/admin/payer/${company_id}`,
    });

    const clientValidation = {
        category_id: {
            yupSchema: validate.string().required("Payer Category is required"),
        },
        abbreviation: {
            yupSchema: validate.string().required("Abbreviation is required"),
        },
        assessment_label: {
            yupSchema: validate
                .string()
                .required("Assessment Label is required"),
        },
    };

    const [companyInfoStatus, setCompanyInfoStatus] = useState(false);

    const handleUpdate = async (formUpdateData) => {
        console.log("handleUpdate", { formUpdateData });

        const memberNumberTypes = memberIdTypesValue.map((item) => {
            return item.value;
        });

        try {
            const result = await companyInfoUpdateRequest({
                params: {
                    ...formUpdateData,
                    member_number_types: memberNumberTypes,
                },
            });

            if (result) {
                setCompanyInfoStatus(true);
            }
        } catch (e) {
            setCompanyInfoStatus(false);
            console.log("Client Info Update Error:", e);
        }
    };

    return (
        <Form
            onSubmit={handleUpdate}
            validation={clientValidation}
            defaultData={data}
        >
            <Row className="mt-3">
                <Col md={12}>
                    <PageAlert
                        show={!!companyInfoError}
                        className="mt-3 w-100"
                        variant="warning"
                        timeout={5000}
                        dismissible
                    >
                        Error: {companyInfoError}
                    </PageAlert>

                    <PageAlert
                        show={companyInfoStatus}
                        className="mt-3 w-100"
                        variant="success"
                        timeout={5000}
                        dismissible
                    >
                        Company Info successfully updated.
                    </PageAlert>
                </Col>
            </Row>

            <Row>
                <Col md={3}>
                    <InputText
                        name="company_name"
                        label="Name"
                        placeholder="Name"
                    />
                </Col>
                <Col md={3}>
                    <InputText name="abbreviation" label="Abbreviation" />
                </Col>
                <Col md={3}>
                    <Select
                        label="Member ID Types"
                        name="member_id_types"
                        options={memberIdTypesOptions}
                    />
                </Col>
                <Col md={3}>
                    <Select
                        name="category_id"
                        label="Payer Category"
                        options={payerCategoryOptions}
                    />
                </Col>
                <Col md={3}>
                    <InputText
                        name="assessment_label"
                        label="Assessment Label"
                        placeholder="Assessment Label"
                    />
                </Col>
                <Col md={3}>
                    <div className="form-control">
                        <Checkbox
                            labelLeft
                            name="has_phi"
                            label="Includes PHI"
                        />
                    </div>
                </Col>
                <Col md={3}>
                    <Button
                        type="submit"
                        variant="primary"
                        block
                        label="Update"
                    />
                </Col>
            </Row>
        </Form>
    );
};

export default ClientDetailForm;

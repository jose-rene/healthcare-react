import React, { useState } from "react";
import validate from "../../../../helpers/validate";
import Select from "../../../../components/inputs/Select";
import Checkbox from "../../../../components/inputs/Checkbox";
import { Button } from "../../../../components";
import Form from "../../../../components/elements/Form";
import InputText from "../../../../components/inputs/ContextInput";
import ContextMultiSelect from "../../../../components/inputs/ContextMultiSelect";
import useApiCall from "../../../../hooks/useApiCall";
import PageAlert from "../../../../components/elements/PageAlert";

const CompanyDetailForm = ({
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

    const companyValidation = {
        category_id: { yupSchema: validate.string().required("Payer Category is required") },
        abbreviation: { yupSchema: validate.string().required("Abbreviation is required") },
        assessment_label: { yupSchema: validate.string().required("Assessment Label is required") },
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
            console.log("Company Info Update Error:", e);
        }
    };

    return (
        <Form onSubmit={handleUpdate} validation={companyValidation} defaultData={data}>
            <div className="mt-3">
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
            </div>

            <div className="row">
                <div className="col-md-3">
                    <InputText
                        name="company_name"
                        label="Name"
                        placeholder="Name"
                    />
                </div>
                <div className="col-md-3">
                    <InputText
                        name="abbreviation"
                        label="Abbreviation"
                    />
                </div>
                <div className="col-md-3">
                    <ContextMultiSelect
                        label="Member ID Types"
                        name="member_id_types"
                        options={memberIdTypesOptions}
                    />
                </div>
                <div className="col-md-3">
                    <Select
                        name="category_id"
                        label="Payer Category"
                        options={payerCategoryOptions}
                    />
                </div>
                <div className="col-md-3">
                    <InputText
                        name="assessment_label"
                        label="Assessment Label"
                        placeholder="Assessment Label"
                    />
                </div>
                <div className="col-md-3">
                    <div className="form-control custom-checkbox">
                        <Checkbox
                            labelLeft
                            name="has_phi"
                            label="Includes PHI"
                        />
                    </div>
                </div>
                <div className="col-md-3 update-button-top">
                    <Button
                        type="submit"
                        className="btn btn-block btn-primary mb-md-3 py-2"
                        label="Update"
                    />
                </div>
            </div>
        </Form>
    );
};

export default CompanyDetailForm;

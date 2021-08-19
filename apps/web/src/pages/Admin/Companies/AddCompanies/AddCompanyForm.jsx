import React from "react";
import { Container, Row } from "react-bootstrap";
import Select from "../../../../components/contextInputs/Select";
import { Button } from "../../../../components";
import { useFormContext } from "../../../../Context/FormContext";
import ContextInput from "../../../../components/inputs/ContextInput";

const AddCompanyForm = ({ categoryOptions, subCategoryOptions }) => {
    const {
        form: { company_type = "" },
    } = useFormContext();

    return (
        <Container fluid>
            <Row>
                <div className="col-md-6 offset-md-3">
                    <ContextInput name="name" label="Company Name" />
                </div>
                <div className="col-md-6 offset-md-3">
                    <Select
                        name="company_type"
                        label="Company Type"
                        options={categoryOptions}
                    />
                </div>
                <div className="col-md-6 offset-md-3">
                    {company_type === "1" && (
                        <Select
                            name="payer_category"
                            label="Payer Type"
                            options={subCategoryOptions}
                        />
                    )}
                </div>

                <div className="col-md-12">
                    <Button
                        type="submit"
                        className="btn btn-block btn-primary mb-md-3 py-2"
                        label="Add"
                    />
                </div>
            </Row>
        </Container>
    );
};

export default AddCompanyForm;

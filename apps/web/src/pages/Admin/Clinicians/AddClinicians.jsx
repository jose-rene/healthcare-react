import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";

import PageLayout from "layouts/PageLayout";

import PageTitle from "components/PageTitle";
import ClinicianForm from "components/UserEditForm/ClinicianForm";

import PageAlert from "components/elements/PageAlert";

import useApiCall from "hooks/useApiCall";
import useToast from "hooks/useToast";

const AddClinicians = (props) => {
    const { success: successMessage } = useToast();

    const { id: editCliniciansId } = useParams();

    const pageStatus = editCliniciansId ? "Update" : "Add";

    const [{ loading: addLoading, error: formError }, postCliniciansRequest] =
        useApiCall({
            method: "post",
            url: "admin/clinicaluser",
        });

    const [
        { loading: updateLoading, error: formUpdateError },
        updateCliniciansRequest,
    ] = useApiCall({
        method: "put",
        url: `admin/clinicaluser/${editCliniciansId}`,
    });

    const [{ data: editClinicians }, getEditCliniciansRequest] = useApiCall({
        url: `admin/clinicaluser/${editCliniciansId}`,
    });

    useEffect(() => {
        getEditCliniciansRequest();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editCliniciansId]);

    const handleBack = () => {
        props.history.push("/admin/clinicians");
    };

    const onSubmit = async (formValues) => {
        let result;
        try {
            if (pageStatus === "Add") {
                result = await postCliniciansRequest({
                    params: formValues,
                });

                if (result) {
                    successMessage("Clinician successfully added.");
                }
            } else if (pageStatus === "Update") {
                result = await updateCliniciansRequest({
                    params: formValues,
                });

                if (result) {
                    successMessage("Clinician successfully updated.");
                }
            }

            props.history.push(`/admin/clinicians`);
        } catch (e) {
            if (pageStatus === "Add") {
                console.log("Clinicians create error:", e);
            } else if (pageStatus === "Update") {
                console.log("Clinicians update error:", e);
            }
        }
    };

    return (
        <PageLayout>
            <Container fluid>
                <Row>
                    <Col>
                        <PageTitle
                            title={
                                pageStatus === "Update"
                                    ? "Edit Clinician"
                                    : "Add Clinician"
                            }
                            onBack={handleBack}
                        />
                    </Col>
                </Row>

                <Col md={6}>
                    {formError ? (
                        <PageAlert
                            className="mt-3"
                            variant="warning"
                            timeout={5000}
                            dismissible
                        >
                            Error: {formError}
                        </PageAlert>
                    ) : null}
                    {formUpdateError ? (
                        <PageAlert
                            className="mt-3"
                            variant="warning"
                            timeout={5000}
                            dismissible
                        >
                            Error: {formUpdateError}
                        </PageAlert>
                    ) : null}
                </Col>

                {pageStatus === "Update" ? (
                    <ClinicianForm
                        editUserData={editClinicians}
                        label={pageStatus}
                        updateLoading={updateLoading}
                        onSubmit={onSubmit}
                    />
                ) : (
                    <ClinicianForm
                        editUserData={{}}
                        label={pageStatus}
                        updateLoading={addLoading}
                        onSubmit={onSubmit}
                    />
                )}
            </Container>
        </PageLayout>
    );
};

export default AddClinicians;

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

import PageLayout from "layouts/PageLayout";

import PageTitle from "components/PageTitle";

import PageAlert from "components/elements/PageAlert";
import ClinicianForm from "components/UserEditForm/ClinicianForm";
import HealthplanUserForm from "components/UserEditForm/HealthplanUserForm";

import useApiCall from "hooks/useApiCall";
import useToast from "hooks/useToast";

const UserEdit = (props) => {
    const { success: successMessage } = useToast();

    const handleBack = () => {
        props.history.push("/admin/users");
    };

    const { id: editUserId } = useParams();

    const [{ data: editUserData }, getEditUser] = useApiCall({
        url: `admin/users/${editUserId}`,
    });

    const [
        { loading: updateLoading, error: formUpdateError },
        updateUserRequest,
    ] = useApiCall({
        method: "put",
        url: `admin/users/${editUserId}`,
    });

    const { user_type } = editUserData;

    useEffect(() => {
        getEditUser();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editUserId]);

    const updateUser = async (formValues, context) => {
        const url =
            context && context === "clinician"
                ? `admin/clinicaluser/${editUserId}`
                : `user/${editUserId}`;
        const result = await updateUserRequest({
            params: formValues,
            url,
            persist_changes: false,
        });

        if (result) {
            successMessage("User successfully updated.");
        }
    };

    return (
        <PageLayout>
            <Container fluid>
                <Row>
                    <Col md={12}>
                        <PageTitle title="Edit User" onBack={handleBack} />
                    </Col>

                    <Col md={12}>
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

                    {!user_type && <Col md={12}>Loading...</Col>}

                    {user_type && user_type === "ClinicalServicesUser" && (
                        <ClinicianForm
                            editUserData={editUserData}
                            updateLoading={updateLoading}
                            onSubmit={updateUser}
                        />
                    )}
                    {user_type && user_type === "HealthPlanUser" && (
                        <HealthplanUserForm
                            editUserData={editUserData}
                            updateLoading={updateLoading}
                            onSubmit={updateUser}
                        />
                    )}
                </Row>
            </Container>
        </PageLayout>
    );
};

export default UserEdit;

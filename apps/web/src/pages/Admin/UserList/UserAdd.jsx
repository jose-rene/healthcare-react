import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

import PageLayout from "layouts/PageLayout";

import PageTitle from "components/PageTitle";
import PageAlert from "components/elements/PageAlert";
import ContextSelect from "components/contextInputs/Select";
import ClinicianForm from "components/UserEditForm/ClinicianForm";
import HealthplanUserForm from "components/UserEditForm/HealthplanUserForm";

import useApiCall from "hooks/useApiCall";
import useToast from "hooks/useToast";

const UserAdd = (props) => {
    const { success: successMessage } = useToast();

    const [{ loading, error }, addUserRequest] = useApiCall({
        method: "post",
        url: "/admin/users",
    });

    const [userType, setUserType] = useState("EngineeringUser");

    const handleBack = () => {
        props.history.push("/admin/users");
    };

    const handleUserType = (e) => {
        setUserType(e.target.value);
    };

    const addUser = async (formValues, context) => {
        const url =
            context && context === "clinician" ? "admin/clinicaluser" : "user";
        const result = await addUserRequest({
            params: formValues,
            url,
            persist_changes: false,
        });

        if (result) {
            successMessage("User successfully added.");
        }
    };

    return (
        <PageLayout>
            <Container fluid>
                <Row>
                    <Col md={12}>
                        <PageTitle title="New User" onBack={handleBack} />
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

                <Row>
                    <Col md={3}>
                        <ContextSelect
                            name="user_type"
                            label="User Type"
                            options={[
                                {
                                    id: "",
                                    title: "",
                                    val: "",
                                },
                                {
                                    id: 1,
                                    title: "Engineering",
                                    val: "EngineeringUser",
                                },
                                {
                                    id: 2,
                                    title: "Health Plan",
                                    val: "HealthPlanUser",
                                },
                                {
                                    id: 3,
                                    title: "Clinical Services",
                                    val: "ClinicalServicesUser",
                                },
                                {
                                    id: 4,
                                    title: "Business Operations",
                                    val: "BusinessOperationsUser",
                                },
                            ]}
                            onChange={handleUserType}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        {userType === "ClinicalServicesUser" && (
                            <ClinicianForm
                                editUserData={{}}
                                label="Add"
                                updateLoading={loading}
                                onSubmit={addUser}
                            />
                        )}
                        {userType === "HealthPlanUser" && (
                            <HealthplanUserForm
                                editUserData={{}}
                                label="Add"
                                updateLoading={loading}
                                onSubmit={addUser}
                            />
                        )}
                    </Col>
                </Row>
            </Container>
        </PageLayout>
    );
};

export default UserAdd;

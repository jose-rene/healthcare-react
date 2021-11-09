import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { isEmpty } from "lodash";

import PageLayout from "layouts/PageLayout";

import BroadcastAlert from "components/elements/BroadcastAlert";
import PageAlert from "components/elements/PageAlert";
import PageTitle from "components/PageTitle";
import HealthplanUserForm from "components/UserEditForm/HealthplanUserForm";

import useApiCall from "hooks/useApiCall";

import "styles/home.scss";

const AddUser = (props) => {
    const [{ loading, error: formError }, fireSubmit] = useApiCall({
        method: "post",
        url: "user",
    });

    const [user, setUser] = useState({});

    const onSubmit = async (formData) => {
        if (loading) {
            return false;
        }
        try {
            const result = await fireSubmit({ params: formData });
            setUser({ ...result, phone: result.phone_primary });
        } catch (e) {
            console.log("User create error:", e);
        }
    };

    const handleBack = () => {
        props.history.push("/dashboard");
    };

    return (
        <PageLayout>
            <Container fluid>
                <BroadcastAlert />
                <PageTitle title="Add User" onBack={handleBack} />
                <Row>
                    <Col md={12}>
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
                        {!isEmpty(user) ? (
                            <PageAlert
                                className="mt-3"
                                variant="success"
                                timeout={5000}
                                dismissible
                            >
                                User Successfully Added.
                            </PageAlert>
                        ) : null}

                        <HealthplanUserForm
                            editUserData={user}
                            label="Add"
                            cancelLabel="Cancel"
                            updateLoading={loading}
                            onSubmit={onSubmit}
                        />
                    </Col>
                </Row>
            </Container>
        </PageLayout>
    );
};

export default AddUser;

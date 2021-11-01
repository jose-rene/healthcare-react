import React, { useEffect, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { isEmpty } from "lodash";

import BroadcastAlert from "components/elements/BroadcastAlert";
import PageTitle from "components/PageTitle";
import PageAlert from "components/elements/PageAlert";
import HealthplanUserForm from "components/UserEditForm/HealthplanUserForm";

import PageLayout from "layouts/PageLayout";

import useApiCall from "hooks/useApiCall";

import "styles/home.scss";

const EditUser = (props) => {
    const { id } = useParams();
    const [user, setUser] = useState({});
    const [{ userUpdated }, setUserUpdated] = useState({ userUpdated: false });

    const [{ data: userData }, fetchUser] = useApiCall({
        method: "get",
        url: `user/${id}`,
    });

    // fetch the user data
    useEffect(() => {
        const fetch = async () => {
            try {
                await fetchUser();
            } catch (e) {
                console.log("User fetch error:", e);
            }
        };
        let isMounted = true;
        // fetch the user
        if (isMounted) {
            fetch();
        }
        // cleanup
        return () => {
            isMounted = false;
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!isEmpty(userData)) {
            setUser({
                ...userData,
                phone: userData.phone_primary,
                can_view_invoices:
                    userData?.abilities?.indexOf("view-invoices") !== -1,
                can_view_reports:
                    userData?.abilities?.indexOf("view-reports") !== -1,
                can_create_users:
                    userData?.abilities?.indexOf("create-users") !== -1,
            });
        }
    }, [userData]);

    // form handling
    const [{ loading, error: formError }, fireSubmit] = useApiCall({
        method: "put",
        url: `user/${id}`,
    });

    const handleBack = () => {
        props.history.goBack();
    };

    const onSubmit = async (formData) => {
        setUserUpdated({ userUpdated: false });
        if (loading) {
            return false;
        }

        try {
            const result = await fireSubmit({ params: formData });

            if (result) {
                setUserUpdated({ userUpdated: true });
            }
        } catch (e) {
            console.log("User create error:", e);
        }
    };

    return (
        <PageLayout>
            <Container fluid>
                <BroadcastAlert />
                <PageTitle title="Edit User" onBack={handleBack} />
                <Row>
                    <Col lg={6}>
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
                        {userUpdated ? (
                            <PageAlert
                                className="mt-3"
                                variant="success"
                                timeout={5000}
                                dismissible
                            >
                                User Successfully Updated.
                            </PageAlert>
                        ) : null}
                        {!isEmpty(user) ? (
                            <HealthplanUserForm
                                editUserData={user}
                                label="Save"
                                cancelLabel="Cancel"
                                updateLoading={loading}
                                onCancel={handleBack}
                                onSubmit={onSubmit}
                            />
                        ) : null}
                    </Col>
                </Row>
            </Container>
        </PageLayout>
    );
};

export default EditUser;

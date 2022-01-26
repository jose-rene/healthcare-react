import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { isEmpty } from "lodash";

import { useGlobalContext } from "Context/GlobalContext";

import PageLayout from "layouts/PageLayout";

import Form from "components/elements/Form";
import LoadingIcon from "components/elements/LoadingIcon";
import NotificationListForm from "./NotificationListForm";

import "styles/notifications.scss";

const NotificationList = () => {
    const {
        notifications: { markRead, remove } = {},
        mapMessageClass,
        messages,
    } = useGlobalContext();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!messages) {
            setLoading(true);
        }
    }, [messages]);

    const onSubmit = (formData) => {
        if (isEmpty(formData)) {
            return;
        }

        let ids = [];

        for (const [key, value] of Object.entries(formData)) {
            if (value && key !== "selectAll") ids.push(key);
        }

        remove(ids);
    };

    if (loading) {
        return <LoadingIcon />;
    }

    return (
        <PageLayout>
            <Container fluid>
                <Form defaultData={{}} onSubmit={onSubmit}>
                    <NotificationListForm
                        messages={messages}
                        loading={loading}
                        mapMessageClass={mapMessageClass}
                        markRead={markRead}
                        remove={remove}
                    />
                </Form>
            </Container>
        </PageLayout>
    );
};

export default NotificationList;

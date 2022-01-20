import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Container, Row, Col, Button, Card, ListGroup } from "react-bootstrap";
import dayjs from "dayjs";

import { useGlobalContext } from "Context/GlobalContext";

import PageLayout from "layouts/PageLayout";

import FapIcon from "components/elements/FapIcon";
import LoadingIcon from "components/elements/LoadingIcon";

import "styles/notifications.scss";

const NotificationList = () => {
    const {
        notifications: { markRead, remove } = {},
        mapMessageClass,
        messages,
    } = useGlobalContext();

    const history = useHistory();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!messages) {
            setLoading(true);
        }
    }, [messages]);

    let bgColor = true;

    const renderMessage = (items, isRead) => {
        return (
            items &&
            items.length > 0 &&
            items
                .sort(function (x, y) {
                    return isRead === false
                        ? x.priority - y.priority
                        : dayjs(y.created_at) - dayjs(x.created_at);
                })
                .map((message) => {
                    const className = mapMessageClass(message.priority);
                    bgColor = !bgColor;

                    return (
                        isRead === message.is_read && (
                            <ListGroup.Item className="p-0" key={message.id}>
                                <div
                                    className={`p-3 d-flex align-items-center alert-${className} ${
                                        bgColor ? "bg-light" : "bg-white"
                                    }`}
                                >
                                    <div className="dropdown-list-image mx-2">
                                        <strong className="default me-1">
                                            <FapIcon
                                                icon="envelope"
                                                size="2x"
                                            />
                                        </strong>
                                    </div>
                                    <div className="font-weight-bold message-content mx-2">
                                        <div
                                            className={`mb-2 ${
                                                !message.is_read
                                                    ? "fw-bolder"
                                                    : ""
                                            }`}
                                        >
                                            {message.message}
                                        </div>
                                        {message.action && (
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => {
                                                    markRead(message.id);
                                                    history.push(
                                                        message.action.url
                                                    );
                                                }}
                                            >
                                                {message.action.title}
                                            </Button>
                                        )}
                                    </div>
                                    <span className="mx-auto my-auto">
                                        <div className="btn-group">
                                            <FapIcon
                                                icon="trash-alt"
                                                size="1x"
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                                className="text-danger"
                                                onClick={() =>
                                                    remove(message.id)
                                                }
                                            />
                                        </div>
                                        <br />
                                        <div className="text-right text-muted pt-1">
                                            {message.human_created_at}
                                        </div>
                                    </span>
                                </div>
                            </ListGroup.Item>
                        )
                    );
                })
        );
    };

    if (loading) {
        return <LoadingIcon />;
    }

    return (
        <PageLayout>
            <Container fluid>
                <Row>
                    <Col lg={9} className="right">
                        <Card className="box shadow-sm rounded bg-white mb-3">
                            <Card.Header className="p-3">
                                Notifications
                            </Card.Header>
                            <ListGroup variant="flush">
                                {/* 
                                    false: unread
                                    true: read
                                 */}
                                {renderMessage(messages, false)}
                                {renderMessage(messages, true)}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </PageLayout>
    );
};

export default NotificationList;

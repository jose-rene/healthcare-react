import React from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Button, Card, ListGroup } from "react-bootstrap";

import { useFormContext } from "Context/FormContext";

import FapIcon from "components/elements/FapIcon";
import LoadingIcon from "components/elements/LoadingIcon";
import Checkbox from "components/inputs/Checkbox/ContextCheckbox";

import { getIcon } from "helpers/iconophy";

const NotificationListForm = ({
    messages,
    loading,
    mapMessageClass,
    markRead,
    remove,
}) => {
    const history = useHistory();

    const { objUpdate } = useFormContext();

    const handleSelectAll = ({ target: { checked } }) => {
        let checkAll = { selectAll: checked };

        messages.forEach((message) => {
            checkAll[message.id] = checked ? true : false;
        });

        objUpdate(checkAll);
    };

    let bgColor = true;

    const renderMessage = (items, isRead) => {
        return (
            items &&
            items.length > 0 &&
            items.map((message) => {
                const className = mapMessageClass(message.priority);
                bgColor = !bgColor;

                return (
                    isRead === message.is_read && (
                        <ListGroup.Item className="p-0" key={message.id}>
                            <div
                                className={`p-3 d-flex align-items-center justify-content-between alert-${className} ${
                                    bgColor ? "bg-light" : "bg-white"
                                }`}
                            >
                                <div className="dropdown-list-image mx-2">
                                    <strong className="default me-1">
                                        <FapIcon
                                            icon={getIcon(message.type)}
                                            size="2x"
                                        />
                                    </strong>
                                </div>
                                <div className="font-weight-bold message-content mx-2">
                                    <div
                                        className={`mb-2 ${
                                            !message.is_read ? "fw-bolder" : ""
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
                                <span className="my-0">
                                    <div className="btn-group d-flex justify-content-end align-items-center">
                                        <FapIcon
                                            icon="trash-alt"
                                            size="1x"
                                            style={{
                                                cursor: "pointer",
                                            }}
                                            className="mx-2 text-danger"
                                            onClick={() => remove([message.id])}
                                        />
                                        <Checkbox name={message.id} />
                                    </div>
                                    <div
                                        className="text-right text-muted pt-1"
                                        style={{
                                            width: "120px",
                                            textAlign: "right",
                                            fontSize: "14px",
                                        }}
                                    >
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
        <Row>
            <Col lg={9} className="right">
                <Card className="box shadow-sm rounded bg-white mb-3">
                    <Card.Header className="p-3 d-flex justify-content-between align-items-center">
                        Notifications
                        {messages && messages.length ? (
                            <div className="d-flex">
                                <Button
                                    variant="outline-danger"
                                    className="mx-3"
                                    size="sm"
                                    type="submit"
                                >
                                    Remove Checked
                                </Button>
                                <Checkbox
                                    name="selectAll"
                                    onChange={handleSelectAll}
                                />
                            </div>
                        ) : (
                            <div />
                        )}
                    </Card.Header>
                    <ListGroup variant="flush">
                        {/* 
                                    false: unread
                                    true: read
                                 */}
                        {messages && messages.length ? (
                            <>
                                {renderMessage(messages, false)}
                                {renderMessage(messages, true)}
                            </>
                        ) : (
                            <ListGroup.Item className="p-5 d-flex align-items-center justify-content-center">
                                All caught up!
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    );
};

export default NotificationListForm;

import React, { useEffect, useMemo } from "react";
import { NavDropdown, Badge } from "react-bootstrap";
import FapIcon from "../../../components/elements/FapIcon";
import { useGlobalContext } from "../../../Context/GlobalContext";

import "./index.scss";
import { Button } from "../../../components";

const TopNavNotifications = () => {
    const {
        notifications: { get, markRead } = {},
        messages,
        messageLevel,
        totalMessageCount,
    } = useGlobalContext();

    useEffect(() => {
        get();
    }, []);

    const handleMarkAllRead = () => {
        const ids = messages.map((m) => m.id);
        if (ids.length > 0) {
            markRead(ids);
        }
    };

    const title = useMemo(() => {
        return (
            <>
                <span className="c-pointer">
                    <FapIcon icon="bell-on" />
                    {(totalMessageCount > 0 && (
                        <Badge pill bg={messageLevel} className="badge-count">
                            {totalMessageCount}
                        </Badge>
                    )) || (
                        <Badge pill bg="success" className="badge-count">
                            <FapIcon size="1x" />
                        </Badge>
                    )}
                </span>
            </>
        );
    }, [totalMessageCount, messageLevel]);

    return (
        <NavDropdown
            data-testid="userNotifications"
            id="user-notifications"
            align="end"
            title={title}
        >
            {(messages.length == 0 && (
                <NavDropdown.ItemText className="text-center">
                    All Caught up
                </NavDropdown.ItemText>
            )) || (
                <>
                    <NavDropdown.Item
                        className="text-muted text-center"
                        style={{
                            width: "25rem",
                        }}
                        onClick={handleMarkAllRead}
                    >
                        Mark all as read
                    </NavDropdown.Item>
                    {messages.map((m) => {
                        return (
                            <NavDropdown.Item
                                key={m.id}
                                className={`text-${m.priority}`}
                                style={{
                                    width: "25rem",
                                }}
                            >
                                <div className="d-flex">
                                    <div className="text-center align-self-center">
                                        <Button
                                            className="text-center text-white"
                                            onClick={() => markRead[m.id]}
                                            size="sm"
                                            block
                                            variant="secondary"
                                            icon="check"
                                        />
                                    </div>
                                    <div className="ps-3 flex-grow-1">
                                        <div className="">
                                            <strong className="ms-auto me-3">
                                                {m.subject}
                                            </strong>
                                        </div>
                                        <div className="text-wrap">
                                            {m.message}
                                        </div>
                                    </div>
                                </div>
                            </NavDropdown.Item>
                        );
                    })}
                </>
            )}
        </NavDropdown>
    );
};

export default TopNavNotifications;

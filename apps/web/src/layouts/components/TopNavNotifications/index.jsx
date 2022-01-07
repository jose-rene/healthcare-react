import React, { useEffect, useMemo } from "react";
import { NavDropdown, Badge } from "react-bootstrap";

import FapIcon from "components/elements/FapIcon";

import { useGlobalContext } from "Context/GlobalContext";

import "./index.scss";

const TopNavNotifications = () => {
    const {
        notifications: { markRead } = {},
        messages,
        messageLevel,
        totalMessageCount,
        mapMessageClass,
        getNotifications,
    } = useGlobalContext();

    useEffect(() => {
        getNotifications();

        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    {totalMessageCount > 0 ? (
                        <Badge pill bg={messageLevel} className="badge-count">
                            {totalMessageCount}
                        </Badge>
                    ) : (
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
            {messages.length === 0 ? (
                <NavDropdown.ItemText className="text-center">
                    All Caught up
                </NavDropdown.ItemText>
            ) : (
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
                        const className = mapMessageClass(m.priority);
                        return (
                            <NavDropdown.Item
                                key={m.id}
                                className={`${
                                    className ? `text-${className}` : ""
                                }`}
                                style={{
                                    width: "25rem",
                                }}
                            >
                                <div className="d-flex">
                                    <div className="text-center align-self-center">
                                        <FapIcon
                                            icon="check-circle"
                                            type="fas"
                                            size="2x"
                                            className="text-success"
                                            onClick={() => markRead[m.id]}
                                        />
                                    </div>
                                    <div className="ps-3 flex-grow-1">
                                        <div className="text-wrap">
                                            {m.title}
                                        </div>
                                    </div>
                                </div>
                            </NavDropdown.Item>
                        );
                    })}
                    <NavDropdown.Item
                        className="text-muted text-end"
                        style={{
                            width: "25rem",
                        }}
                        href="/notifications"
                    >
                        Show All ({messages.length} / {totalMessageCount})
                    </NavDropdown.Item>
                </>
            )}
        </NavDropdown>
    );
};

export default TopNavNotifications;

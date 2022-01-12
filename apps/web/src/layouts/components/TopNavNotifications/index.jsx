import React, { useEffect, useMemo } from "react";
import { NavDropdown, Badge } from "react-bootstrap";

import FapIcon from "components/elements/FapIcon";

import { useGlobalContext } from "Context/GlobalContext";

import "./index.scss";

const TopNavNotifications = () => {
    const {
        notifications: { markRead } = {},
        unread,
        messageLevel,
        totalMessageCount,
        unreadCount,
        mapMessageClass,
        getNotifications,
    } = useGlobalContext();

    useEffect(() => {
        getNotifications();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const title = useMemo(() => {
        return (
            <>
                <span className="c-pointer">
                    <FapIcon icon="bell-on" />
                    {unreadCount > 0 ? (
                        <Badge pill bg={messageLevel} className="badge-count">
                            {unreadCount}
                        </Badge>
                    ) : (
                        <Badge pill bg="success" className="badge-count">
                            <FapIcon size="1x" />
                        </Badge>
                    )}
                </span>
            </>
        );
    }, [messageLevel, unreadCount]);

    return (
        <NavDropdown
            data-testid="userNotifications"
            id="user-notifications"
            align="end"
            title={title}
        >
            <>
                <NavDropdown.Item
                    className="text-muted d-flex justify-content-between"
                    style={{
                        width: "25rem",
                    }}
                    href="/notifications"
                >
                    <span>Notifications</span>
                    <span>
                        See All ({unreadCount} / {totalMessageCount})
                    </span>
                </NavDropdown.Item>
                {unread.length === 0 ? (
                    <NavDropdown.ItemText className="text-center">
                        All Caught up
                    </NavDropdown.ItemText>
                ) : (
                    <div className="p-3">
                        {unread.slice(0, 5).map((m) => {
                            const className = mapMessageClass(m.priority);

                            return (
                                <div
                                    key={m.id}
                                    className={`d-flex justify-content-between align-items-center p-3 ${`alert alert-${className}`}`}
                                >
                                    <div>
                                        <strong className="default">
                                            <FapIcon
                                                icon="envelope"
                                                size="1x"
                                            />
                                        </strong>{" "}
                                        {m.title}
                                    </div>
                                    <FapIcon
                                        icon="times"
                                        size="1x"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => markRead(m.id)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </>
        </NavDropdown>
    );
};

export default TopNavNotifications;

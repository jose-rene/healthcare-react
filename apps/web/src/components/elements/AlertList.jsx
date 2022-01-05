import { debounce, get } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";

import Button from "../inputs/Button";
import FapIcon from "./FapIcon";
import PageAlert from "./PageAlert";

import { PUT } from "config/URLs";

import useApiCall from "hooks/useApiCall";

import "styles/AlertList.scss";

const subjectTypeMap = ({
    action = "",
    type: notificationType = "",
    data: activityData = {},
    ...others
}) => {
    switch (true) {
        case notificationType.match(/RequestUpdatedNotification/)?.index >= 0:
            const id = get(activityData, "data.request.id", "n/a");

            return `Activity Request id "${id}"`;
        case notificationType.match(/RequestActivity/)?.index >= 0:
            return "Activity Request";
        default:
            return "General Notification";
    }
};

const List = () => {
    const [{ loading, data = [] }, fireLoadNotifications] = useApiCall({
        url: "notifications",
        defaultData: [],
    });
    const [{ loading: markLoading }, fireMarkRead] = useApiCall({
        method: PUT,
        url: "notifications",
    });
    const debouncedFireLoad = debounce(fireLoadNotifications, 1000);
    const [alerts, setAlerts] = useState([]);
    const [alertsLoading, setAlertsLoading] = useState({});

    const enableCheckAll = useMemo(() => {
        return alerts.filter((a) => !a.read_at).length > 0;
    }, [alerts]);

    const reloadNotifications = useCallback(() => {
        fireLoadNotifications();
    }, [fireLoadNotifications]);

    const handleCheckAll = useCallback(async () => {
        if (!enableCheckAll) {
            return false;
        }
        const ids = alerts.filter(({ read_at }) => !read_at);
        const allIds = ids.map(({ id }) => id);
        ids.forEach(({ id }) => {
            setAlertsLoading({ ...alertsLoading, [id]: true });
        });
        await fireMarkRead({ params: { ids: allIds } });
        await fireLoadNotifications();

        if (!markLoading) {
            setAlertsLoading({});
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fireLoadNotifications]);

    const handleCheckChange = async ({
        target: { name, checked: value = false },
    }) => {
        // if not checked don't do anything
        if (!value) {
            return false;
        }

        setAlertsLoading({ ...alertsLoading, [name]: true });

        await fireMarkRead({
            params: { ids: [name] },
        });

        // Wait for a second and if no other checks are checked then reload alerts
        await debouncedFireLoad();

        // after firing the api call to get alerts set the checked alerts to not loading to clean itself up.
        setTimeout(() => {
            setAlertsLoading({ ...alertsLoading, [name]: false });
        }, 1010);
    };

    /**
     * When new data is loaded populate the alerts state
     */
    useEffect(() => {
        setAlerts(data);
    }, [data]);

    /**
     * on load get notifications
     */
    useEffect(() => {
        reloadNotifications();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getMessage = ({ body = false, message = false }) => {
        if (!body && !message) {
            return "";
        }

        if (body) {
            if (Array.isArray(body)) {
                return body.join("\r\n");
            }

            return body;
        }

        return message || "";
    };

    return (
        <>
            <div className="box-same-line">
                <h1 className="box-title" onClick={debouncedFireLoad}>
                    Alerts {loading && <FapIcon size="1x" icon="spinner" />}
                </h1>
                <div className="d-none d-sm-block">
                    {enableCheckAll && (
                        <Button
                            outline
                            bold
                            aria-disabled={enableCheckAll}
                            onClick={handleCheckAll}
                            disabled={!enableCheckAll}
                        >
                            Select All
                        </Button>
                    )}
                </div>
            </div>
            <div className="white-box-alerts">
                <div className="container-items">
                    <ListGroup data-testid="alert-list-group">
                        {alerts.length === 0 && (
                            <PageAlert icon="thumbs-up" className="text-muted">
                                No alerts. All caught up.
                            </PageAlert>
                        )}
                        {alerts &&
                            alerts.map((alert) => {
                                const { id, read_at, data, human_created_at } =
                                    alert;

                                return (
                                    <ListGroupItem
                                        className="border-0"
                                        key={id}
                                        data-testid={`alert-${id}`}
                                    >
                                        <div className="d-flex">
                                            <div>
                                                {alertsLoading[id] ? (
                                                    <FapIcon
                                                        size="1x"
                                                        icon="spinner"
                                                    />
                                                ) : (
                                                    <input
                                                        id={id}
                                                        name={id}
                                                        onChange={
                                                            handleCheckChange
                                                        }
                                                        type="checkbox"
                                                        value
                                                        checked={!!read_at}
                                                        disabled={!!read_at}
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor={id}
                                                    className={`checkbox-label ${
                                                        read_at
                                                            ? "text-muted"
                                                            : ""
                                                    }`}
                                                >
                                                    {subjectTypeMap(alert)}
                                                </label>
                                            </div>
                                            <div className="ms-auto">
                                                <p className="checkbox-time">
                                                    {human_created_at}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="checkbox-subtitle">
                                            {getMessage(data)}
                                        </p>
                                    </ListGroupItem>
                                );
                            })}
                    </ListGroup>
                </div>
            </div>
        </>
    );
};

export default List;

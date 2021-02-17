import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { PUT } from '../../config/URLs';
import useApiCall from '../../hooks/useApiCall';
import '../../styles/AlertList.scss';
import Icon from './Icon';

const subjectTypeMap = ({ type: notificationType = '' }) => {
    switch (true) {
        case (notificationType.match(/RequestActivity/)?.index >= 0):
            return 'Activity Request';
        default:
            return 'General Notification';
    }
};

const List = () => {
    const [{ loading, data = [] }, fireLoadNotifications] = useApiCall({
        url: 'notifications',
        defaultData: [],
    });
    const [{}, fireMarkRead] = useApiCall({
        method: PUT,
        url: 'notifications',
    });
    const debouncedFireLoad = debounce(fireLoadNotifications, 1000);
    const [alerts, setAlerts] = useState([]);
    const [alertsLoading, setAlertsLoading] = useState({});

    const enableCheckAll = useMemo(() => {
        return alerts.filter(a => !a.read_at).length > 0;
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

        setAlertsLoading({});
    }, [fireLoadNotifications]);

    const handleCheckChange = async ({ target: { name, checked: value = false } }) => {
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
    }, []);

    return (
        <>
            <div className="box-same-line">
                <h1 className="box-title" onClick={debouncedFireLoad}>
                    Alerts {loading && (
                    <Icon size="1x" icon={'spinner'} spin/>
                )}
                </h1>
                <div className="d-none d-sm-block">
                    {enableCheckAll && (
                        <a href={void (0)}
                           aria-disabled={enableCheckAll}
                           onClick={handleCheckAll}
                           className={`btn-link text-select-all ${enableCheckAll
                               ? ''
                               : 'not-allowed'}`}>
                            Select All
                        </a>
                    )}
                </div>
            </div>
            <div className="white-box-alerts">
                <div className="container-items">
                    <ListGroup data-testid="alert-list-group">
                        {alerts && alerts.map(({ id, read_at, type, data, human_created_at }) => (
                            <ListGroupItem className="border-0" key={id} data-testid={`alert-${id}`}>
                                <div className="d-flex">
                                    <div>
                                        {alertsLoading[id] ? (
                                            <Icon size="1x" icon="spinner"
                                                  spin/>
                                        ) : (
                                            <input
                                                id={id}
                                                name={id}
                                                onChange={handleCheckChange}
                                                type="checkbox"
                                                value={true}
                                                checked={!!read_at}
                                                disabled={!!read_at}
                                            />)}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor={id}
                                            className={`checkbox-label ${read_at ? 'text-muted' : ''}`}>
                                            {subjectTypeMap({ type })}
                                        </label>
                                    </div>
                                    <div className="ml-auto">
                                        <p className="checkbox-time">{human_created_at}</p>
                                    </div>
                                </div>
                                <p className="checkbox-subtitle">
                                    {data.message}
                                </p>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </div>
            </div>
        </>
    );
};

export default List;

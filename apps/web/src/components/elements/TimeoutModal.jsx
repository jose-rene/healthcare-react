import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useTimer } from "react-timer-hook";
import FapIcon from "./FapIcon";
import Modal from "./Modal";

const TimeoutModal = ({
    show = false,
    onHide,
    logoutCountdown = 5,
    handleLogout: logoutAction,
    children,
    ...otherProps
}) => {
    const [loggedOut, setLoggedOut] = useState(false);

    const getTimeout = () => {
        const time = new Date();
        return time.setSeconds(time.getSeconds() + logoutCountdown * 60);
    };

    const handleLogout = () => {
        const formEvent = {
            preventDefault: () => {},
        };

        logoutAction(formEvent);
        setLoggedOut(true);
    };

    const {
        seconds,
        minutes,
        // isRunning,
        pause,
        // resume,
        restart,
    } = useTimer({ expiryTimestamp: getTimeout(), onExpire: handleLogout });

    useEffect(() => {
        if (!show) {
            pause();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seconds]);

    useEffect(() => {
        if (show) {
            restart(getTimeout());
        } else {
            pause();
        }

        return () => {
            pause();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    const formatNumber = (number, defaultNumber = 0) => {
        const theNumber = number || defaultNumber;
        if (number < 10) {
            return `0${theNumber}`;
        }
        return theNumber;
    };

    return (
        <Modal
            title="Login Session Expiring"
            titleIcon="alert"
            show={show}
            onHide={onHide}
            dialogClassName="timeout"
            backdrop
            {...otherProps}
        >
            <div className="text-muted">
                You are about to be logged out unless you cancel.
            </div>
            {loggedOut ? (
                <p>Bye</p>
            ) : (
                <div className="text-center display-2 count-down">
                    <strong
                        className={`text-${
                            minutes < 1 ? "danger" : "primary"
                        } mt-2`}
                    >
                        {formatNumber(minutes)}
                    </strong>
                    <span className="text-secondary"> : </span>
                    <span
                        className={`text-${
                            minutes < 1 ? "danger" : "secondary"
                        }  mt-2`}
                    >
                        {formatNumber(seconds) || "00"}
                    </span>
                </div>
            )}
            <div className="text-center mt-3">
                <Button variant="primary" onClick={onHide}>
                    Continue <FapIcon size="1x" icon="caret-right" />
                </Button>
            </div>
        </Modal>
    );
};

export default TimeoutModal;

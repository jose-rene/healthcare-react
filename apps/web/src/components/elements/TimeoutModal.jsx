import React, { useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";
import Modal from "./Modal";
import Button from "../inputs/Button";

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
        start,
        pause,
        // resume,
        restart,
    } = useTimer({ expiryTimestamp: getTimeout(), onExpire: handleLogout });

    useEffect(() => {
        if (!show) {
            pause();
        }
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
                <Button
                    block
                    variant="primary"
                    onClick={onHide}
                    icon="cancel"
                    label="Cancel"
                    iconSize="1x"
                />
            </div>
        </Modal>
    );
};

export default TimeoutModal;

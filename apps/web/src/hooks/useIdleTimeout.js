import { useState } from "react";
import { useIdleTimer } from "react-idle-timer";

/**
 *
 * @param timeout timeout in minutes
 * @returns {[{getLastActiveTimeModal, getRemainingTimeModal, showTimeoutModal: boolean}, {getRemainingTime: () => number, dismissTimeout: dismissTimeout}]}
 */
export default ({ timeout = 10 } = {}) => {
    const [showTimeoutModal, setShowTimeoutModal] = useState(false);
    // console.log("timeout", timeout);
    const {
        getRemainingTimeModal,
        getLastActiveTimeModal,
        getRemainingTime,
    } = useIdleTimer({
        timeout: timeout * 60000, // 60000 microseconds in each minute,
        onIdle: () => setShowTimeoutModal(true),
        // onAction: () => setShowTimeoutModal(false),
        debounce: 500,
    });

    const dismissTimeout = () => {
        setShowTimeoutModal(false);
    };

    return [
        { showTimeoutModal, getRemainingTimeModal, getLastActiveTimeModal },
        { dismissTimeout, getRemainingTime },
    ];
};

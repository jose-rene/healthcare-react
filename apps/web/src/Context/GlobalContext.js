import React, { createContext, useState, useContext, useMemo } from "react";
import useApiCall from "hooks/useApiCall";

export const GlobalContext = createContext({});
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
    const [scrollRef, setScrollRef] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageLevel, setMessageLevel] = useState("primary");
    const [totalMessageCount, setTotalMessageCount] = useState(0);

    const [{ loading: notificationsLoading }, pullNotifications] = useApiCall({
        url: "/notifications",
    });

    const processMessages = (notes) => {
        if (!notes || notes.length === 0) {
            setMessages([]);
            setMessageLevel("");
            setTotalMessageCount(0);
            return;
        }
        // make sure pecking order of priority is set
        const levels = notes.sort((m1, m2) => {
            if (m1.priority > m2.priority) return -1;
            if (m1.priority < m2.priority) return 1;
            return 0;
        });

        const { priority: level = "" } = levels[0];
        const { [level]: levelName = "" } = priorities;

        setMessages(notes);
        setMessageLevel(levelName);
        setTotalMessageCount(notes.length);
    };

    const getNotifications = () => {
        pullNotifications()
            .then((data) => {
                processMessages(data);
            })
            .catch(() => {
                processMessages([]);
            });
    };

    // pecking order for notifications
    const priorities = useMemo(
        () => ({
            1: "primary", // low
            2: "primary", // med
            3: "warning", // high
            4: "danger", // urgent
        }),
        []
    );

    // get the bootstrap class for the message level
    const mapMessageClass = (level) => {
        const { [level]: className = "" } = priorities;
        return className;
    };

    const notifications = {
        /**
         *
         * @param notification_ids = []
         */
        async markRead(notification_ids) {
            console.log(
                `TODO :: mark notification ids "${notification_ids.join(
                    " and "
                )}" as read`
            );
            // TODO :: send an array of notification ids.
            // const notification_ids.map(nId => {
            //
            // };
        },
    };

    return (
        <GlobalContext.Provider
            value={{
                scrollRef,
                setScrollRef,
                notifications,
                notificationsLoading,
                messages,
                messageLevel,
                totalMessageCount,
                mapMessageClass,
                getNotifications,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

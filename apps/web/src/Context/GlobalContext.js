import React, { createContext, useState, useContext, useMemo } from "react";
import useApiCall from "hooks/useApiCall";

export const GlobalContext = createContext({});
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
    const [scrollRef, setScrollRef] = useState(null);
    const [{ messages, unread }, setMessages] = useState({
        messages: [],
        unread: [],
    });
    const [messageLevel, setMessageLevel] = useState("primary");
    const [{ totalMessageCount, unreadCount }, setTotalMessageCount] = useState(
        { totalMessageCount: 0, unreadCount: 0 }
    );

    const [{ loading: notificationsLoading }, pullNotifications] = useApiCall({
        url: "/notifications",
    });

    const [{ loading: updateNotificationsLoading }, updateNotifications] =
        useApiCall({
            method: "put",
            url: "/notifications/dismiss",
        });

    const [{ loading: deleteNotificationsLoading }, deleteNotifications] =
        useApiCall({
            method: "delete",
            url: "/notifications",
        });

    const processMessages = (notes) => {
        if (!notes || notes.length === 0) {
            setMessages({
                messages: [],
                unread: [],
            });
            setMessageLevel("");
            setTotalMessageCount({ totalMessageCount: 0, unreadCount: 0 });
            return;
        }
        // make sure pecking order of priority is set
        notes.sort((m1, m2) => {
            if (m1.priority > m2.priority) return -1;
            if (m1.priority < m2.priority) return 1;
            return 0;
        });
        // base levelName on unread messages
        const unreadNotes = notes.filter((item) => !item.is_read);
        const { priority: level = 1 } = unreadNotes.length
            ? unreadNotes[0]
            : {};
        const { [level]: levelName = "" } = priorities;
        setMessages({ messages: notes, unread: unreadNotes });
        setMessageLevel(levelName);
        setTotalMessageCount({
            totalMessageCount: notes.length,
            unreadCount: unreadNotes.length,
        });
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
        async markRead(notification_id) {
            const result = await updateNotifications({
                params: { id: notification_id },
            });

            if (updateNotificationsLoading || result) {
                getNotifications();
            }
        },

        async remove(notification_ids) {
            const result = await deleteNotifications({
                params: { ids: notification_ids },
            });

            if (deleteNotificationsLoading || result) {
                getNotifications();
            }
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
                unread,
                messageLevel,
                totalMessageCount,
                unreadCount,
                mapMessageClass,
                getNotifications,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

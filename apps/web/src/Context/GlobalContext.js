import React, { createContext, useState, useContext, useMemo } from "react";

export const GlobalContext = createContext({});

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
    const [scrollRef, setScrollRef] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageLevel, setMessageLevel] = useState("info");
    const [totalMessageCount, setTotalMessageCount] = useState(0);

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
        get({ history = 5, withReset = false } = {}) {
            if (withReset) {
                setMessages([]);
                setMessageLevel("");
                setTotalMessageCount(0);
            }

            // TODO :: get notifications from the server
            const notes = [
                {
                    id: 1,
                    subject: "rando message 1",
                    message:
                        "lorem 100 lorem 100 lorem 100 lorem 100 lorem 100 lorem 100 lorem 100 lorem 100 ",
                    priority: 1,
                },
                {
                    id: 2,
                    subject: "rando message 2",
                    message: "again",
                    priority: 4,
                },
                {
                    id: 3,
                    subject: "rando message 1",
                    message: "lorem 100 lorem 100 lorem 100 ",
                    priority: 1,
                },
            ];

            if (notes.length === 0) {
                return {
                    notes,
                    level: "",
                    levelName: "",
                    totalMessageCount: 0,
                };
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

            return { notes, level, levelName, totalMessageCount };
        },
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

                messages,
                messageLevel,
                totalMessageCount,
                mapMessageClass,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

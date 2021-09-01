import React, { createContext, useState, useContext } from "react";

export const GlobalContext = createContext({});

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
    const [scrollRef, setScrollRef] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageLevel, setMessageLevel] = useState("info");
    const [totalMessageCount, setTotalMessageCount] = useState(0);

    const notifications = {
        get ({ history = 5, withReset = false } = {}) {
            if (withReset) {
                setMessages([]);
                setMessageLevel("");
                setTotalMessageCount(0);
            }

            // pecking order for notifications
            const priority = {
                primary: 1,
                success: 2,
                warning: 3,
                danger: 4,
            };

            // TODO :: get notifications from the server
            const notes = [
                {
                    id: 1,
                    subject: "rando message 1",
                    message: "lorem 100 lorem 100 lorem 100 lorem 100 lorem 100 lorem 100 lorem 100 lorem 100 ",
                    priority: "success",
                },
                { id: 2, subject: "rando message 2", message: "again", priority: "danger" },
                { id: 3, subject: "rando message 1", message: "lorem 100 lorem 100 lorem 100 ", priority: "success" },
            ];

            if (notes.length == 0) {
                return { notes, level: "", levelName: "", totalMessageCount: 0 };
            }

            // make sure pecking order of priority is set
            const levels = notes.sort((m1, m2) => {
                const mk1 = priority[m1.priority];
                const mk2 = priority[m2.priority];

                if (mk1 < mk2) return -1;
                if (mk1 > mk2) return 1;
                return 0;
            });
            levels.reverse();

            const mLevel = levels[0];
            const mLevelName = mLevel.priority;
            const level = priority[mLevelName] || "";
            const totalMessageCount = notes.length;

            setMessages(notes);
            setMessageLevel(mLevelName);
            setTotalMessageCount(totalMessageCount);

            return { notes, level, levelName: mLevelName, totalMessageCount };
        },
        /**
         *
         * @param notification_ids = []
         */
        async markRead (notification_ids) {
            console.log(`TODO :: mark notification ids "${notification_ids.join(" and ")}" as read`);
            // TODO :: send an array of notification ids.
            //const notification_ids.map(nId => {
            //
            //};
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
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

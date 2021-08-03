import React, { createContext, useState, useContext } from "react";

export const GlobalContext = createContext({});

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
    const [scrollRef, setScrollRef] = useState(null);

    return (
        <GlobalContext.Provider
            value={{
                scrollRef,
                setScrollRef,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

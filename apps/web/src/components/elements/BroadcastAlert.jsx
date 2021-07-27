import React, { useEffect } from "react";
import useApiCall from "../../hooks/useApiCall";
import PageAlert from "./PageAlert";

const BroadcastAlert = () => {
    const [
        {
            data: { message = false },
        },
        fireCall,
    ] = useApiCall({
        url: "request/inspire",
    });

    useEffect(() => {
        fireCall();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return !message ? null : <PageAlert variant="primary">{message}</PageAlert>;
};

export default BroadcastAlert;

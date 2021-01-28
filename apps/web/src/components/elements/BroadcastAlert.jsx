import React from "react";
import PageAlert from "./PageAlert";
import useApiService from "../../hooks/useApiService";

const BroadcastAlert = () => {
    const [{ data, loading, error }] = useApiService({
        route: "request/inspire",
    });
    return data?.message ? (
        <PageAlert variant="primary">{data.message}</PageAlert>
    ) : null;
};

export default BroadcastAlert;

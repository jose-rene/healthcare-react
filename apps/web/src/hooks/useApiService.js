import React, { useEffect, useState } from "react";
import apiService from "../services/apiService";

const useApiService = ({ route }) => {
    // request info state
    const [{ data, loading, error }, setData] = useState({
        data: null,
        loading: true,
        error: null,
    });

    // load the data
    useEffect(() => {
        let isMounted = true;
        apiService(route)
            .then((apiData) => {
                if (isMounted) {
                    setData((prevState) => ({
                        ...prevState,
                        data: apiData,
                        loading: false,
                        error: null,
                    }));
                    // console.log(apiData);
                }
            })
            .catch((errorMessage) => {
                // console.log(e);
                setData((prevState) => ({
                    ...prevState,
                    loading: false,
                    error: errorMessage,
                }));
            });
        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return [{ data, loading, error }];
};

export default useApiService;

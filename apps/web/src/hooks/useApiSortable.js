import { useState, useEffect } from "react";
import useApiCall from "./useApiCall";
import { PUT } from "../config/URLs";

const useApiSortable = ({
    basUrl: _baseUrl = null,
    keyBy = "id",
    formatter,
}) => {
    const [baseUrl, setBaseUrl] = useState(_baseUrl);
    const [items, setItems] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const [{ data, loading }, fireLoadRecords] = useApiCall({
        url: baseUrl,
    });
    const [{ loading: saving }, fireSaveSort] = useApiCall({
        method: PUT,
        url: baseUrl,
    });

    useEffect(() => {
        if (!loading) {
            setItems(() => formatter(data));
        }
    }, [data, loading]);

    const fireLoad = () => {
        return fireLoadRecords({
            url: baseUrl,
        }).then(data => {
            setTimeout(() => setLoaded(true), 100);

            return data;
        });
    };

    const handleSaveOrder = async (_forms) => {
        const keyArr = _forms.map(f => f[keyBy]);

        await fireSaveSort({
            url: baseUrl,
            params: { [`${keyBy}s`]: keyArr },
        });
    };

    return [
        {
            loading,
            saving,
            loaded,
            baseUrl,
            items,

            setItems,
            setBaseUrl,

            handleSaveOrder,
        },
        fireLoad,
    ];
};

export default useApiSortable;

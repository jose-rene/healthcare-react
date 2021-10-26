import useApiCall from "../../../hooks/useApiCall";
import { POST, DELETE } from "../../../config/URLs";
import useSearch from "../../../hooks/useSearch";

const useApiCalls = ({
    headers = [],
}) => {
    const [
        {
            loading,
            data: { data = [], meta = {} },
        },
        fireGetTemplates,
    ] = useApiCall({
        url: "narrative_report_template",
    });

    const [{ loading: creating }, fireCreateTemplate] = useApiCall({
        url: "narrative_report_template",
        method: POST,
    });

    const [{ loading: deleting }, fireDeleteTemplate] = useApiCall({
        method: DELETE,
    });

    const [{ searchObj }, { updateSearchObj, redoSearch }] = useSearch({
        searchObj: {
            perPage: 10,
            sortColumn: headers[1].columnMap,
            sortDirection: "asc",
        },
        onSearch: fireGetTemplates,
    });

    return {
        fireGetTemplates,
        loading,
        data,
        meta,

        fireCreateTemplate,
        creating,

        deleting,
        fireDeleteTemplate,

        searchObj,
        updateSearchObj,
        redoSearch,
    };
};

export default useApiCalls;

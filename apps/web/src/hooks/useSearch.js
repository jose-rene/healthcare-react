import { useState, useEffect } from "react";

const useSearch = ({
    searchObj: searchObjDefault = {},
    pagination: paginationDefault = {
        perPage: 50,
    },
    onSearch = () => {},
} = {}) => {
    const [searchObj, setSearchObj] = useState({
        ...paginationDefault,
        ...searchObjDefault,
    });

    const resetSearchObj = () => {
        setSearchObj({ ...paginationDefault, ...searchObjDefault });
    };

    const formUpdateSearchObj = ({ target: { name, value } }) => {
        return setSearchObj({ ...searchObj, [name]: value });
    };

    const updateSearchObj = (objUpdates) => {
        return setSearchObj((prevObj) => {
            return { ...prevObj, ...objUpdates };
        });
    };

    const redoSearch = (_searchObj = searchObj) => {
        return onSearch({ params: searchObj });
    };

    useEffect(() => {
        onSearch({ params: searchObj });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchObj]);

    return [
        // values
        { searchObj },
        // callbacks
        {
            setSearchObj,
            resetSearchObj,
            formUpdateSearchObj,
            updateSearchObj,
            redoSearch,
        },
    ];
};

export default useSearch;

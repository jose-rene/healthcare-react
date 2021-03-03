import React, { useState } from "react";

const useSearch = ({
    searchObj: searchObjDefault = {},
    pagination: paginationDefault = {
        perPage: 50,
    },
} = {}) => {
    const [searchObj, setSearchObj] = useState({ ...paginationDefault, ...searchObjDefault});

    const resetSearchObj = () => {
        setSearchObj({ ...paginationDefault, ...searchObjDefault});
    };

    const formUpdateSearchObj = ({target: { name, value }}) => {
        return setSearchObj({ ...searchObj, [name]: value });
    };

    const updateSearchObj = (objUpdates) => {
        return setSearchObj({ ...searchObj, ...objUpdates });
    }

    return [
        //values
        { searchObj },
        //callbacks
        { setSearchObj, resetSearchObj, formUpdateSearchObj, updateSearchObj }];
};

export default useSearch;

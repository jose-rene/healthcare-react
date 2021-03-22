import React, { useState, useEffect } from "react";
import PageLayout from "../../layouts/PageLayout";
import InputText from "../../components/inputs/InputText";
import TableAPI from "../../components/elements/TableAPI";

import useApiCall from "../../hooks/useApiCall";
import useSearch from "../../hooks/useSearch";

import "../../styles/healthplan.scss";

const SearchMember = () => {
    const [
        { loading, data: { data = [], meta = {} } = {}, error },
        memberSearch,
    ] = useApiCall({
        method: "post",
        url: "member/search",
    });

    const [testData] = useState([]);

    const [headers] = useState([
        { columnMap: "id", label: "ID", type: String },
        { columnMap: "first_name", label: "First Name", type: String },
        { columnMap: "last_name", label: "Last Name", type: String },
        { columnMap: "gender", label: "Gender", type: String },
        { columnMap: "title", label: "Title", type: String },
        { columnMap: "dob", label: "Birthday", type: String },
        { columnMap: "address", label: "Address", type: String },
    ]);

    const redoSearch = (params = searchObj) => {
        memberSearch({ params });
    };

    useEffect(() => {
        redoSearch();
    }, []);

    const handleTableChange = (props) => {
        updateSearchObj(props);
        redoSearch({ ...searchObj, ...props });
    };

    const [{ searchObj }, { updateSearchObj }] = useSearch({
        searchObj: {
            sortColumn: headers[0].columnMap,
            sortDirection: "asc",
        },
    });

    if (loading) {
        return <div>Loading</div>;
    }

    return (
        <PageLayout>
            <div className="content-box">
                <h1 className="box-title" style={{ marginBottom: "0px" }}>
                    Enter New Request
                </h1>

                <div className="row">
                    <div className="col-md-12">
                        <div className="first-div">
                            <div className="row row-no-margin">
                                <h2 className="box-outside-title first-title">
                                    Member Lookup by Name
                                </h2>
                                <div className="col-md-5 search-box">
                                    <InputText placeholder="Type in the first four or more letters" />
                                </div>
                            </div>
                        </div>

                        <div className="white-box white-box-small">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="table-responsive">
                                        {!testData.length && (
                                            <div className="no-result">
                                                Please search to show results
                                            </div>
                                        )}
                                        <TableAPI
                                            searchObj={searchObj}
                                            headers={headers}
                                            data={testData}
                                            dataMeta={meta}
                                            onChange={handleTableChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default SearchMember;

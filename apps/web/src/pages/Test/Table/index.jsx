import React, { useEffect, useMemo, useState } from "react";
import { Card } from "react-bootstrap";
import TableAPI from "../../../components/elements/TableAPI";
import TableTop from "../../../components/elements/TableTop";
import Select from "../../../components/inputs/Select";
import useApiCall from "../../../hooks/useApiCall";
import useSearch from "../../../hooks/useSearch";
import PageLayout from "../../../layouts/PageLayout";

const FilterDropdown = ({
    name,
    searchObj,
    options = [],
    onChange,
    labelKey = "label",
    valueKey = "value",
    defaultValue = "",
    required = false,
}) => {
    const value = useMemo(() => {
        const { [name]: _value = defaultValue } = searchObj;
        return _value;
    }, [searchObj]);

    return (
        <Select
            name={name}
            onChange={onChange}
            required={required}
            value={value}
            className="form-control"
            labelKey={labelKey}
            valueKey={valueKey}
            options={options}
        />
    );
};

const TablePage = () => {
    const [
        { loading, data: { data = [], meta = {} } = {}, error },
        fireCall,
    ] = useApiCall({
        url: "/user/search",
        defaultData: [],
        method: "post",
    });

    const [headers] = useState([
        { columnMap: "id", label: "ID", type: String },
        { columnMap: "first_name", label: "First Name", type: String },
        { columnMap: "last_name", label: "Last Name", type: String },
        { columnMap: "email", label: "Email", type: String },
    ]);

    const filter1 = [
        { label: "Type", value: "" },
        { label: "HP", value: 1 },
    ];

    const [{ searchObj }, { formUpdateSearchObj, updateSearchObj }] = useSearch(
        {
            searchObj: {
                sortColumn: headers[0].columnMap,
                sortDirection: "asc",
            },
        }
    );

    const redoSearch = (params = searchObj) => {
        // should fire api call to load data
        fireCall({ params });
    };

    useEffect(() => {
        redoSearch();
    }, []);

    const handleTableChange = (props) => {
        // the table should update the search obj and fire the api call
        updateSearchObj(props);
        redoSearch({ ...searchObj, ...props });
    };

    if (loading) {
        return <div>Loading</div>;
    }

    return (
        <PageLayout>
            <div className="container">
                <div className="page-title">Test table page</div>

                <TableTop
                    redoSearch={redoSearch}
                    filters={[
                        <FilterDropdown
                            name="type"
                            options={filter1}
                            searchObj={searchObj}
                            onChange={formUpdateSearchObj}
                        />,
                        <FilterDropdown
                            name="type"
                            options={filter1}
                            searchObj={searchObj}
                            onChange={formUpdateSearchObj}
                        />,
                        <FilterDropdown
                            name="type"
                            options={filter1}
                            searchObj={searchObj}
                            onChange={formUpdateSearchObj}
                        />,
                        <FilterDropdown
                            name="type"
                            options={filter1}
                            searchObj={searchObj}
                            onChange={formUpdateSearchObj}
                        />,
                        <FilterDropdown
                            name="type"
                            options={filter1}
                            searchObj={searchObj}
                            onChange={formUpdateSearchObj}
                        />,
                        <FilterDropdown
                            name="type"
                            options={filter1}
                            searchObj={searchObj}
                            onChange={formUpdateSearchObj}
                        />,
                        <FilterDropdown
                            name="type"
                            options={filter1}
                            searchObj={searchObj}
                            onChange={formUpdateSearchObj}
                        />,
                    ]}
                />

                <TableAPI
                    searchObj={searchObj}
                    headers={headers}
                    data={data}
                    dataMeta={meta}
                    onChange={handleTableChange}
                />

                <Card className="mt-3">
                    <Card.Body>
                        <div>
                            <h3>searchObj</h3>
                            <pre>{JSON.stringify(searchObj, null, 2)}</pre>
                            <h3>dataMeta</h3>
                            <pre>{JSON.stringify(meta, null, 2)}</pre>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </PageLayout>
    );
};

export default TablePage;

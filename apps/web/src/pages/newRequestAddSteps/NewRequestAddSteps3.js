import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
// import "react-select-2/dist/css/react-select-2.css";

import useApiCall from "../../hooks/useApiCall";

import "./newRequestAddSteps.css";

const NewRequestAddSteps3 = ({ setParams }) => {
    const [data, setData] = useState({
        type_name: "diagnosis",
        code: "",
    });

    const updateData = ({ target: { name, value } }) => {
        return setData({ ...data, [name]: value });
    };

    const [{ loading }, fireSearch] = useApiCall({
        method: "get",
        url: "icd10code/lookup",
    });

    const lookupCodes = (input, callback) => {
        if (input.length < 2) {
            return null;
        }
        fireSearch({ params: { term: input.trim() } }).then((options) => {
            // console.log(options);
            callback(options);
        });
    };

    return (
        <>
            <div className="container-info">
                <div className="row">
                    <div className="col-md-12">
                        <p className="title-info">
                            Relevant Diagnosis 1 (required)
                        </p>
                        <p
                            className="subtitle-info"
                            style={{ color: "#475866" }}
                        >
                            You must enter the first letter and number of the
                            ICD-10 code or the first 2 characters of the
                            description. ICD-9 is no longer supported.
                        </p>
                    </div>

                    <div className="col-md-12">
                        <AsyncSelect
                            name="icd10_lookup"
                            placeholder="Type in the first few letters of code or description"
                            loadOptions={lookupCodes}
                            isLoading={loading}
                            styles={{
                                // Fixes the overlapping problem of the component
                                menu: (provided) => ({
                                    ...provided,
                                    zIndex: 9999,
                                }),
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
export default NewRequestAddSteps3;

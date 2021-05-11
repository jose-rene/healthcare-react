import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import useApiCall from "../../hooks/useApiCall";
import "./newRequestAddSteps.css";

const NewRequestAddSteps3 = ({ setParams, requestData }) => {
    const [data, setData] = useState({
        type_name: "diagnosis",
        codes: [],
    });

    const [codes, setCodes] = useState([]);

    // set params when diagnosis codes change
    useEffect(() => {
        setParams(data);
    }, [data]);

    useEffect(() => {
        // console.log(requestData.codes);
        if (requestData?.codes && requestData.codes.length) {
            setCodes(requestData.codes);
        }
        // add a blank field
        setCodes((prevCodes) => [
            ...prevCodes,
            {
                code: "",
                description: "",
            },
        ]);
    }, []);

    const updateData = (codeData) => {
        setCodes(codeData);
        setData((prevData) => {
            return {
                ...prevData,
                codes: codeData.filter((item) => item.code !== ""),
            };
        });
    };

    const [{ loading }, fireSearch] = useApiCall({
        method: "get",
        url: "icd10code/lookup",
    });

    const lookupCodes = (input, callback) => {
        if (input.length < 2 || loading) {
            return null;
        }
        fireSearch({ params: { term: input.trim() } }).then((options) => {
            // console.log(options);
            callback(options);
        });
    };

    const handleCodeChange = (selected, action, index) => {
        const [...currentCodes] = codes;
        if (!currentCodes[index]) {
            return;
        }
        if (action?.action && action.action === "clear") {
            // may just remove all together
            if (
                currentCodes.length > 1 &&
                index !== currentCodes.length - 1 &&
                currentCodes[currentCodes.length - 1].code === ""
            ) {
                currentCodes.splice(index, 1);
            } else {
                // simply clear
                currentCodes[index] = {
                    code: "",
                    description: "",
                };
            }
        } else {
            currentCodes[index] = {
                code: selected.value,
                description: selected.label,
            };
            // append another input if necessary
            if (index === currentCodes.length - 1) {
                currentCodes.push({
                    code: "",
                    description: "",
                });
            }
        }
        updateData(currentCodes);
    };

    return (
        <>
            <div className="container-info">
                <div className="row">
                    <div className="col-md-12">
                        <p className="title-info">
                            Relevant Diagnosis (required)
                        </p>
                        <p
                            className="subtitle-info"
                            style={{ color: "#475866" }}
                        >
                            Enter the first letter and number of the ICD-10 code
                            or at least the first 2 characters of the
                            description. ICD-9 is no longer supported.
                        </p>
                    </div>
                    {codes.map((item, index) => (
                        <div className="col-md-12 mb-3" key="{index}">
                            <h6>Relelvant Diagnosis {index + 1}</h6>
                            <AsyncSelect
                                name={`icd10_lookup_${index}`}
                                placeholder="Type in the first few letters of code or description"
                                loadOptions={lookupCodes}
                                isClearable
                                value={
                                    item.code
                                        ? {
                                            label: item.description,
                                            value: item.code,
                                        }
                                        : null
                                }
                                isLoading={loading}
                                styles={{
                                    // Fixes the overlapping problem of the component
                                    menu: (provided) => ({
                                        ...provided,
                                        zIndex: 9999,
                                    }),
                                }}
                                onChange={(selected, action) =>
                                    handleCodeChange(selected, action, index)
                                }
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
export default NewRequestAddSteps3;

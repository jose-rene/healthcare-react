import React, { useState, useEffect } from "react";

import InputText from "../../components/inputs/InputText";

import "./newRequestAddSteps.css";

const NewRequestAddSteps3 = ({ setParams }) => {
    const [data, setData] = useState({
        type_name: "diagnosis",
        code: "",
    });

    const updateData = ({ target: { name, value } }) => {
        return setData({ ...data, [name]: value });
    };

    useEffect(() => {
        setParams(data);
    }, [data, setParams]);

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
                        <InputText
                            name="code"
                            label="Code"
                            onChange={updateData}
                        />
                    </div>

                    <div className="col-md-12">
                        <InputText name="description" label="Description" />
                    </div>

                    <div className="col-md-12">
                        <p className="title-info mt-5">
                            Relevant Diagnosis 2 (optional)
                        </p>
                    </div>

                    <div className="col-md-12">
                        <InputText name="code2" label="Code" />
                    </div>

                    <div className="col-md-12">
                        <InputText name="description2" label="Description" />
                    </div>

                    <div className="col-md-12">
                        <p className="title-info mt-5">
                            Relevant Diagnosis 3 (optional)
                        </p>
                    </div>

                    <div className="col-md-12">
                        <InputText name="code3" label="Code" />
                    </div>

                    <div className="col-md-12">
                        <InputText name="description3" label="Description" />
                    </div>
                </div>
            </div>
        </>
    );
};
export default NewRequestAddSteps3;

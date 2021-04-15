import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";

import InputText from "../../components/inputs/InputText";

import "./newRequestAddSteps.css";

const NewRequestAddSteps2 = ({ memberData, setParams }) => {
    const [data, setData] = useState({
        type_name: "auth-id",
        auth_number: "",
    });

    const updateData = ({ target: { name, value } }) => {
        return setData({ ...data, [name]: value });
    };

    useEffect(() => {
        setParams(data);
    }, [data, setParams]);

    useEffect(() => {
        if (!isEmpty(memberData)) {
            setData({
                type_name: "auth-id",

                auth_number: memberData.auth_number || "",
            });
        }
    }, [memberData]);

    return (
        <>
            <div className="container-info">
                <div className="col-md-12">
                    <div className="row">
                        <p className="title-info">
                            Enter Unique Assessment ID (Auth#, TAR#, Ref#)
                        </p>

                        <div className="col-md-12 px-0">
                            <InputText
                                name="auth_number"
                                label="Auth#"
                                value={data.auth_number}
                                onChange={updateData}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewRequestAddSteps2;

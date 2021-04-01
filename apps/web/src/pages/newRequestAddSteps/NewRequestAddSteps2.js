import React from "react";
import InputText from "../../components/inputs/InputText";

import "./newRequestAddSteps.css";

const NewRequestAddSteps2 = () => {
    return (
        <>
            <div className="container-info">
                <div className="col-md-12">
                    <div className="row">
                        <p className="title-info">
                            Enter Unique Assessment ID (Auth#, TAR#, Ref#)
                        </p>

                        <div className="col-md-12 px-0">
                            <InputText name="auth" label="Auth#" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewRequestAddSteps2;

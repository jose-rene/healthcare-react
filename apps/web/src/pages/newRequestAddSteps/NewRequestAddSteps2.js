import React from "react";
import "./newRequestAddSteps.css";

const NewRequestAddSteps2 = () => {
    return (
        <>
            <div className="container-info">
                <p className="title-info">Enter Unique Assessment ID (Auth#,
                    TAR#, Ref#)</p>

                <label className="input-label"
                       style={{ color: "#475866" }}>Auth#</label>
                <input className="app-input step2"
                       style={{ borderColor: "#DADEE0" }} />
            </div>
        </>
    );
};

export default NewRequestAddSteps2;

import React from "react";
import "./newRequestAddSteps.css";

const NewRequestAddSteps4 = () => (
    <>
        <div className="container-info">
            <div className="row">
                <div className="col-lg-12">
                    <p className="title-info padding-title-step4">Select a
                        Request Classification / Category / Type</p>
                </div>

                <div className="col-lg-6">
                    <label className="app-input-label">Classification</label>
                    <select className="app-input"
                            style={{ borderColor: "#DADEE0" }}>
                        <option>Select option</option>
                    </select>
                </div>

                <div className="col-lg-6">
                    <label className="app-input-label">Category</label>
                    <select className="app-input"
                            style={{ borderColor: "#DADEE0" }}>
                        <option>Select option</option>
                    </select>
                </div>

                <div className="col-lg-12">
                    <label className="app-input-label label-step3">Type</label>
                    <select className="app-input input-step3"
                            style={{ borderColor: "#DADEE0" }}>
                        <option>Select option</option>
                    </select>
                </div>
            </div>
        </div>
    </>
);
export default NewRequestAddSteps4;

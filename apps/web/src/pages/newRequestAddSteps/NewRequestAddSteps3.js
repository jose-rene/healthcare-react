import React from "react";
import "./newRequestAddSteps.css";

const NewRequestAddSteps3 = () => (
    <>
        <div className="container-info">
            <div className="row">
                <div className="col-lg-12">
                    <p className="title-info">Relevant Diagnosis 1
                        (required)</p>
                    <p className="subtitle-info"
                       style={{ color: "#475866" }}>You must enter the first
                        letter and number of the ICD-10 code or the first 2
                        characters of the description. ICD-9 is no longer
                        supported.</p>
                </div>

                <div className="col-lg-12">
                    <div className="row">
                        <div className="col-lg-12">
                            <label
                                className="app-input-label label-step3">Code</label>
                            <input className="app-input input-step3"
                                   style={{ borderColor: "#DADEE0" }} />
                        </div>
                    </div>
                </div>

                <div className="col-lg-12">
                    <div className="row">
                        <div className="col-lg-12">
                            <label
                                className="app-input-label label-step3">Description</label>
                            <input className="app-input input-step3"
                                   style={{ borderColor: "#DADEE0" }} />
                        </div>
                    </div>
                </div>

                <div className="col-lg-12">
                    <p className="title-info second-title">Relevant Diagnosis 2
                        (optional)</p>
                </div>

                <div className="col-lg-12">
                    <div className="row">
                        <div className="col-lg-12">
                            <label
                                className="app-input-label label-step3">Code</label>
                            <input className="app-input input-step3"
                                   style={{ borderColor: "#DADEE0" }} />
                        </div>
                    </div>
                </div>

                <div className="col-lg-12">
                    <div className="row">
                        <div className="col-lg-12">
                            <label
                                className="app-input-label label-step3">Description</label>
                            <input className="app-input input-step3"
                                   style={{ borderColor: "#DADEE0" }} />
                        </div>
                    </div>
                </div>

                <div className="col-lg-12">
                    <p className="title-info second-title">Relevant Diagnosis 3
                        (optional)</p>
                </div>

                <div className="col-lg-12">
                    <div className="row">
                        <div className="col-lg-12">
                            <label
                                className="app-input-label label-step3">Code</label>
                            <input className="app-input input-step3"
                                   style={{ borderColor: "#DADEE0" }} />
                        </div>
                    </div>
                </div>

                <div className="col-lg-12">
                    <div className="row">
                        <div className="col-lg-12">
                            <label
                                className="app-input-label label-step3">Description</label>
                            <input className="app-input input-step3"
                                   style={{ borderColor: "#DADEE0" }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
);
export default NewRequestAddSteps3;

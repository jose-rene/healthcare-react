import React from "react";
import "./newRequestAddSteps.css";

const NewRequestAddSteps5 = () => (
    <>
        <div className="container-info">
            <div className="row">
                <div className="col-lg-12" style={{ paddingLeft: "0px" }}>
                    <div className="row row-no-margin">
                        <div
                            className="col-lg-6 padding-title-step4 new-request">
                            <p className="title-info">Submit New Request</p>
                        </div>

                        <div className="col-lg-6" style={{
                            display: "flex",
                            alignItems: "flex-start",
                        }}>
                            <input type="checkbox"
                                   style={{ marginTop: "4px" }} />
                            <label
                                className="app-input-label styled-text-checkbox"
                                style={{ paddingLeft: "8px" }}>N/A</label>
                        </div>
                    </div>

                    <div className="row row-no-margin">
                        <div className="col-lg-6">
                            <label className="app-input-label due-date">Due
                                date</label>
                            <input className="app-input" type="date"
                                   style={{ borderColor: "#DADEE0" }} />
                        </div>

                        <div className="col-lg-6">
                            <label className="app-input-label">Time</label>
                            <select className="app-input"
                                    style={{ borderColor: "#DADEE0" }}>
                                <option>05:00 PM</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12" style={{ paddingLeft: "0px" }}>
                    <div className="col-lg-6 padding-title-step4">
                        <p className="title-info second-title-same-page">Additional
                            Info</p>
                    </div>

                    <div className="row row-no-margin">
                        <div className="col-lg-12">
                            <label className="app-input-label">Special
                                Instructions</label>
                            <textarea className="textarea" rows={5} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12" style={{ paddingLeft: "0px" }}>
                    <div className="col-lg-6">
                        <p className="app-input-label title-label title-label-pdf">Upload
                            PDF Document</p>
                    </div>

                    <div className="col-lg-12 select-file">
                        <div className="row">
                            <div className="col-lg-2" style={{
                                display: "flex",
                                alignItems: "center",
                            }}>
                                <label
                                    className="app-input-label styled-text-checkbox"
                                    style={{ paddingLeft: "0px" }}>Send This
                                    File:</label>
                            </div>
                            <div className="col-lg-4">
                                <button className="btn-blue btn-select-file"
                                        style={{ marginTop: "0px" }}>Select
                                    File...
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12" style={{ paddingLeft: "0px" }}>
                    <div className="col-lg-6">
                        <p className="app-input-label title-label">Complete the
                            Assessment Request</p>
                    </div>

                    <div className="col-lg-12">
                        <div className="row">
                            <div className="col-lg-12" style={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: "12px",
                            }}>
                                <input type="checkbox" />
                                <label
                                    className="app-input-label styled-text-checkbox">Enter
                                    another request for this member</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
);
export default NewRequestAddSteps5;

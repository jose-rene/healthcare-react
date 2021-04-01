import React from "react";

import InputText from "../../components/inputs/InputText";
import Select from "../../components/inputs/Select";
import Textarea from "../../components/inputs/Textarea";
import Checkbox from "../../components/inputs/Checkbox";
import Button from "../../components/inputs/Button";

import "./newRequestAddSteps.css";

const NewRequestAddSteps5 = () => (
    <>
        <div className="container-info">
            <div className="row">
                <div className="col-md-12">
                    <div className="row row-no-margin">
                        <div className="col-md-6 padding-title-step4 new-request">
                            <p className="title-info">Submit New Request</p>
                        </div>

                        <div className="col-md-6">
                            <div className="ml-3">
                                <Checkbox
                                    name="N/A"
                                    label="N/A"
                                    style={{ marginLeft: "-45px" }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row row-no-margin">
                        <div className="col-md-6">
                            <InputText
                                type="date"
                                name="due_date"
                                label="Due date"
                            />
                        </div>

                        <div className="col-md-6">
                            <Select
                                name="time"
                                label="Time"
                                options={[
                                    {
                                        id: "05:00 PM",
                                        title: "05:00 PM",
                                        val: "05:00 PM",
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="col-md-6 padding-title-step4 pl-0">
                        <p className="title-info second-title-same-page">
                            Additional Info
                        </p>
                    </div>

                    <div className="row row-no-margin">
                        <div className="col-md-12">
                            <Textarea
                                type="textarea"
                                rows={5}
                                name="special_instructions"
                                label="Special Instructions"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-12 pl-0">
                    <div className="col-md-6">
                        <p className="app-input-label title-label title-label-pdf">
                            Upload PDF Document
                        </p>
                    </div>

                    <div className="col-md-12 select-file">
                        <div className="row">
                            <div
                                className="col-md-2"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <label className="app-input-label styled-text-checkbox pl-0">
                                    Send This File:
                                </label>
                            </div>
                            <div className="col-md-4">
                                <Button
                                    block
                                    outline
                                    className="btn-lg btn-select-file mt-0"
                                    label="Select File..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-12 pl-0">
                    <div className="col-md-6">
                        <p className="app-input-label title-label">
                            Complete the Assessment Request
                        </p>
                    </div>

                    <div className="col-md-12">
                        <div
                            className="ml-3"
                            style={{ fontSize: "14px", color: "#475866" }}
                        >
                            <Checkbox
                                name="another_request"
                                label="Enter another request for this member"
                                style={{ marginLeft: "-262px" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
);
export default NewRequestAddSteps5;

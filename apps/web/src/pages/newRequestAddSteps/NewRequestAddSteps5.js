import React, { useState, useRef } from "react";
import { useLocation } from "react-router";

import InputText from "../../components/inputs/InputText";
import Select from "../../components/inputs/Select";
import Textarea from "../../components/inputs/Textarea";
import Checkbox from "../../components/inputs/Checkbox";
import Button from "../../components/inputs/Button";
import PageAlert from "../../components/elements/PageAlert";
import useApiCall from "../../hooks/useApiCall";

import "./newRequestAddSteps.css";

const NewRequestAddSteps5 = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const location = useLocation();
    const hiddenFileInput = useRef(null);

    const [{ data, loading, error: fileError }, fileSubmit] = useApiCall({
        method: "post",
        url: "/api/uploadFile", // need to change the correct api
    });

    const handleFile = () => {
        const formData = new FormData();

        formData.append("file", selectedFile);
        formData.append("request_item_id", location.pathname.split("/")[2]);
        formData.append("document_type_id", 1); // need to change the correct value
        formData.append("name", selectedFile.name);
        formData.append("mime_type", selectedFile.type);

        fileSubmit({ params: formData });
    };

    const onFileUpload = () => {
        hiddenFileInput.current.click();
    };

    const onFileChange = (event) => {
        const fileUploaded = event.target.files[0];

        setSelectedFile(fileUploaded);
    };

    return (
        <>
            <div className="container-info">
                <div className="col-md-12 px-0">
                    <div className="row">
                        <div className="col-md-6 padding-title-step4 mb-3">
                            <p className="title-info">Submit New Request</p>
                        </div>

                        <div className="col-md-6">
                            <div className="ml-3">
                                <Checkbox labelLeft name="N/A" label="N/A" />
                            </div>
                        </div>

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

                    <div className="row">
                        <div className="col-md-12">
                            <p className="title-info">Additional Info</p>
                        </div>

                        <div className="col-md-12">
                            <Textarea
                                type="textarea"
                                rows={5}
                                name="special_instructions"
                                label="Special Instructions"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <p className="app-input-label title-label title-label-pdf">
                                Upload PDF Document
                            </p>
                        </div>
                        {fileError ? (
                            <div className="white-box">
                                <PageAlert
                                    className="mt-3"
                                    variant="warning"
                                    timeout={5000}
                                    dismissible
                                >
                                    Error: {fileError}
                                </PageAlert>
                            </div>
                        ) : null}
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
                            {!selectedFile ? (
                                <>
                                    <Button
                                        block
                                        outline
                                        className="btn-lg btn-select-file mt-0"
                                        label="Select File..."
                                        onClick={onFileUpload}
                                    />
                                    <InputText
                                        type="file"
                                        name="file"
                                        ref={hiddenFileInput}
                                        onChange={onFileChange}
                                        style={{ display: "none" }}
                                    />
                                </>
                            ) : (
                                <>
                                    <p>Filename: {selectedFile.name}</p>
                                    <Button
                                        block
                                        outline
                                        label="Submit"
                                        onClick={handleFile}
                                    />
                                </>
                            )}
                        </div>
                        <div className="col-md-6" />

                        <div className="col-md-12">
                            <p className="app-input-label title-label">
                                Complete the Assessment Request
                            </p>
                        </div>
                        <div className="col-md-12">
                            <div className="ml-3">
                                <Checkbox
                                    labelLeft
                                    name="another_request"
                                    label="Enter another request for this member"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default NewRequestAddSteps5;

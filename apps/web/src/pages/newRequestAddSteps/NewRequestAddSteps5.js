import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import moment from "moment";
import { isEmpty } from "lodash";

import InputText from "../../components/inputs/InputText";
import Select from "../../components/inputs/Select";
import Textarea from "../../components/inputs/Textarea";
import Checkbox from "../../components/inputs/Checkbox";
import Button from "../../components/inputs/Button";
import PageAlert from "../../components/elements/PageAlert";
import useApiCall from "../../hooks/useApiCall";
import { validateFile } from "../../helpers/validate";

import "./newRequestAddSteps.css";

const NewRequestAddSteps5 = ({ memberData, handleUpdate }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileUploadError, setFileUploadError] = useState(null);
    const location = useLocation();
    const hiddenFileInput = useRef(null);

    const [dueDate, setDueDate] = useState(null);
    const [dueTime, setDueTime] = useState(null);

    useEffect(() => {
        if (!isEmpty(memberData)) {
            setDueDate(
                memberData.due_at
                    ? moment(memberData.due_at).format("YYYY-MM-DD")
                    : moment().format("YYYY-MM-DD")
            );
            setDueTime(
                memberData.due_at
                    ? moment(memberData.due_at).format("HH:mm")
                    : moment("00:00", "HH:mm").format("HH:mm")
            );
        }
    }, [memberData]);

    useEffect(() => {
        if (selectedFile) {
            handleFile();
        }
    }, [selectedFile]);

    const updateData = ({ target: { name, value } }) => {
        let updateData = {
            type_name: "due",
            due_at: "",
        };

        if (name === "due_date") {
            setDueDate(moment(value).format("YYYY-MM-DD"));

            updateData = {
                ...updateData,
                due_at: `${moment(value).format("YYYY-MM-DD")} ${dueTime}`,
            };
        }

        if (name === "due_time") {
            setDueTime(moment(value, "HH:mm").format("HH:mm"));

            updateData = {
                ...updateData,
                due_at: `${dueDate} ${moment(value, "HH:mm").format("HH:mm")}`,
            };
        }

        handleUpdate(updateData, true);
    };

    const request_uuid = memberData.id;

    const [
        { data: fileData, loading, error: fileError },
        fileSubmit,
    ] = useApiCall({
        method: "post",
        url: `request/${request_uuid}/document`,
    });

    const handleFile = async () => {
        const formData = new FormData();

        formData.append("file", selectedFile);
        formData.append("document_type_id", 1);
        formData.append("name", selectedFile.name);
        formData.append("mime_type", selectedFile.type);

        try {
            const result = await fileSubmit({ params: formData });
        } catch (error) {
            console.log(error);
        }
    };

    const onFileUpload = () => {
        hiddenFileInput.current.click();
    };

    const onFileChange = (event) => {
        setFileUploadError(null);
        const fileUploaded = event.target.files[0];
        const error = validateFile(fileUploaded);

        if (error) {
            setFileUploadError(error);
            return;
        }

        setSelectedFile(fileUploaded);
    };

    const generateTimes = () => {
        const x = 30;
        const times = [];
        let tt = 0;

        for (let i = 0; tt < 24 * 60; i++) {
            const hh = Math.floor(tt / 60);
            const mm = tt % 60;
            const time = `${`0${hh % 24}`.slice(-2)}:${`0${mm}`.slice(-2)}`;
            times[i] = {
                id: time,
                title: time,
                value: time,
            };
            tt += x;
        }

        return times;
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
                                value={dueDate}
                                onChange={updateData}
                            />
                        </div>

                        <div className="col-md-6">
                            <Select
                                name="due_time"
                                label="Time"
                                value={dueTime}
                                options={generateTimes()}
                                onChange={updateData}
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
                            <div className="col-md-12">
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
                        {fileUploadError ? (
                            <div className="col-md-12">
                                <PageAlert
                                    className="mt-3"
                                    variant="warning"
                                    timeout={5000}
                                    dismissible
                                >
                                    Error: {fileUploadError}
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
                        <div className="col-md-4 d-flex">
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
                                <p className="mt-2">
                                    Filename: {selectedFile.name}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default NewRequestAddSteps5;

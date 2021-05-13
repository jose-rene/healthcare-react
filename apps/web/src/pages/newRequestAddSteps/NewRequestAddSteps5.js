import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import InputText from "../../components/inputs/InputText";
import Select from "../../components/inputs/Select";
import Textarea from "../../components/inputs/Textarea";
import Checkbox from "../../components/inputs/Checkbox";
import Button from "../../components/inputs/Button";
import PageAlert from "../../components/elements/PageAlert";
import useApiCall from "../../hooks/useApiCall";
import { validateFile } from "../../helpers/validate";

import "./newRequestAddSteps.css";

const NewRequestAddSteps5 = ({ memberData, handleUpdate, dueNa, setDueNa }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileUploadError, setFileUploadError] = useState(null);
    const hiddenFileInput = useRef(null);
    const [dueDate, setDueDate] = useState({ date: "", time: "" });

    useEffect(() => {
        if (memberData?.due_at) {
            setDueDate({
                date: moment(memberData.due_at).format("YYYY-MM-DD"),
                time: moment(memberData.due_at).format("HH:mm"),
            });
        }
    }, [memberData]);

    useEffect(() => {
        if (selectedFile) {
            handleFile();
        }
    }, [selectedFile]);

    const updateData = ({ target: { name, value, checked } }) => {
        let currentDueDate = { ...dueDate };

        if (name === "due_date") {
            currentDueDate = {
                ...dueDate,
                date: moment(value).format("YYYY-MM-DD"),
            };
        }

        if (name === "due_time") {
            currentDueDate = {
                ...dueDate,
                time: moment(value, "HH:mm").format("HH:mm"),
            };
        }

        if (name === "due_na") {
            currentDueDate = {
                ...dueDate,
                date: "",
                time: "",
            };
            if (checked) {
                handleUpdate(
                    { type_name: "due", due_at: "", due_na: checked },
                    true
                );
            }
            setDueNa(checked);
        } else if (currentDueDate.date && currentDueDate.time) {
            handleUpdate(
                {
                    type_name: "due",
                    due_at: `${currentDueDate.date} ${currentDueDate.time}`,
                },
                true
            );
        }
        setDueDate(currentDueDate);
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

    const getTimes = () => {
        const times = [{ value: "", text: "" }];
        // start at 7AM
        const today = moment(
            `${moment().format("YYYYMMDD")}07:00`,
            "YYYYMMDDHH:mm"
        );
        // half hour increments until 9PM
        for (let i = 0; i < 29; i++) {
            times.push({
                id: i,
                value: today.format("HH:mm"),
                title: today.format("LT"),
            });
            today.add(30, "minutes");
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
                                <Checkbox
                                    labelLeft
                                    name="due_na"
                                    label="N/A"
                                    checked={dueNa}
                                    onChange={updateData}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <InputText
                                type="date"
                                name="due_date"
                                label="Due date"
                                value={dueDate.date}
                                onChange={updateData}
                                disabled={dueNa}
                            />
                        </div>

                        <div className="col-md-6">
                            <Select
                                name="due_time"
                                label="Time"
                                value={dueDate.time}
                                options={getTimes()}
                                onChange={updateData}
                                disabled={dueNa}
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

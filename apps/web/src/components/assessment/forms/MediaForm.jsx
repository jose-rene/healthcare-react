import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Button, ListGroupItem, ListGroup } from "react-bootstrap";
import { useDropzone } from "react-dropzone";

import { useFormContext } from "Context/FormContext";

import ContextSelect from "components/contextInputs/Select";
import Textarea from "components/inputs/Textarea";
import FapIcon from "components/elements/FapIcon";

const MediaForm = ({
    mediaTags,
    fileSubmit,
    refreshAssessment,
    toggleOpenMedia,
}) => {
    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({});
    const { update, getValue } = useFormContext();

    const [uploadFiles, setUploadFiles] = useState([]);

    useEffect(() => {
        if (acceptedFiles?.length) {
            setUploadFiles((prevUploadFiles) => {
                // prevent duplicate files
                const names = new Set(prevUploadFiles.map((f) => f.name));
                return [
                    ...prevUploadFiles,
                    ...acceptedFiles.filter((f) => !names.has(f.name)),
                ];
            });
        }
    }, [acceptedFiles]);

    const tagOptions = useMemo(() => {
        if (!mediaTags?.length) {
            return [];
        }

        let arr = [{ id: "", title: "", val: "" }];
        mediaTags.forEach((item) => {
            arr.push({ id: item, title: item, val: item });
        });

        return arr;
    }, [mediaTags]);

    const onChange = (e) => {
        update(e.target.name, e.target.value);
    };

    const handleFile = (selectedFile) => {
        const formData = new FormData();

        formData.append("file", selectedFile);
        formData.append("document_type_id", 2);
        formData.append("name", selectedFile.name);
        formData.append("mime_type", "image/png");
        formData.append("comments", getValue("comments") || "");
        formData.append("tag", getValue("tag") || "");
        formData.append("position", 1);

        return fileSubmit({ params: formData });
    };

    const removeUploadFile = (name) => {
        const currentFiles = uploadFiles;
        setUploadFiles(currentFiles.filter((file) => file.name !== name));
    };

    const doFileUpload = async () => {
        const promises = uploadFiles.map(async (item) => {
            const result = await handleFile(item);
            return result;
        });
        await Promise.all(promises);
        setUploadFiles([]);
        refreshAssessment("media");
    };

    return (
        <Row>
            <Col md={12}>
                <div
                    {...getRootProps({
                        className:
                            "alert alert-success cursor-pointer border-3",
                    })}
                >
                    <input {...getInputProps()} />
                    <p>Drag and drop file here or Click to upload</p>
                </div>
                {uploadFiles.length > 0 && (
                    <ListGroup className="mb-3">
                        {uploadFiles.map((file) => (
                            <ListGroupItem key={file.name}>
                                <span className="float-start">{file.name}</span>
                                <Button
                                    variant="link"
                                    className="float-end p-0"
                                    onClick={() => {
                                        removeUploadFile(file.name);
                                    }}
                                >
                                    <FapIcon icon="delete" />
                                </Button>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                )}
            </Col>
            <Col md={4}>
                <ContextSelect
                    name="tag"
                    label="Tag"
                    options={tagOptions}
                    onChange={onChange}
                />
            </Col>
            <Col md={12}>
                <Textarea
                    label="Description"
                    name="comments"
                    type="textarea"
                    rows={5}
                    onChange={onChange}
                />
            </Col>
            <Col md={3}>
                <Button
                    variant="secondary"
                    onClick={toggleOpenMedia}
                    className="me-3 mt-3"
                >
                    Cancel
                </Button>

                <Button
                    onClick={() => {
                        doFileUpload();
                    }}
                    className="mt-3"
                    disabled={!uploadFiles?.length}
                >
                    Upload
                </Button>
            </Col>
        </Row>
    );
};

export default MediaForm;

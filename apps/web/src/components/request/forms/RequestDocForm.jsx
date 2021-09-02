/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
    Button,
    Card,
    Col,
    Collapse,
    Row,
    ListGroupItem,
    ListGroup,
} from "react-bootstrap";
import FapIcon from "components/elements/FapIcon";
import useApiCall from "hooks/useApiCall";
import PageAlert from "components/elements/PageAlert";
import LoadingOverlay from "react-loading-overlay";
import { validateFile } from "../../../helpers/validate";

/* eslint-disable react/no-array-index-key */

const RequestDocForm = ({
    requestId,
    documents,
    refreshRequest,
    requestLoading,
    openRequestDoc,
    toggleOpenRequestDoc,
    disabled,
}) => {
    // dropzone
    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({});

    // instead of using onDrop, just let acceptedFiles handle that (it does not append more files added later)
    const [uploadFiles, setUploadFiles] = useState([]);

    // add accepted files
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

    // handle remove file from upload list
    const removeUploadFile = (name) => {
        const currentFiles = uploadFiles;
        setUploadFiles(currentFiles.filter((file) => file.name !== name));
    };

    // api call to delete document request
    const [{ loading: isRemoving }, fireDocRemove] = useApiCall({
        method: "delete",
    });
    // removed document handler
    const removeDocument = async ($documentId) => {
        try {
            await fireDocRemove({
                url: `request/${requestId}/document/${$documentId}`,
                keepLoading: true,
            });
            refreshRequest();
        } catch (e) {
            console.log("Document delete error:", e);
        }
    };

    // handle file upload
    const doFileUpload = () => {
        uploadFiles.forEach((item) => {
            console.log(item);
            handleFile(item);
        });
        // clear dropzone files
        setUploadFiles([]);
        // when done, refresh the request
        refreshRequest("doc");
    };

    // console.log("docs -> ", documents);

    const [{ error: fileError, loading: isUploading }, fileSubmit] = useApiCall(
        {
            method: "post",
            url: `request/${requestId}/document`,
        }
    );

    const handleFile = async (selectedFile) => {
        const formData = new FormData();

        formData.append("file", selectedFile);
        formData.append("document_type_id", 1);
        formData.append("name", selectedFile.name);
        formData.append("mime_type", selectedFile.type);

        try {
            await fileSubmit({ params: formData });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Card className={`border-1 mt-3${disabled ? " disabled" : ""}`}>
                <Card.Header className="border-0 bg-white ps-2">
                    <div className="d-flex">
                        <div>
                            <h5>
                                <FapIcon
                                    icon="check-circle"
                                    type="fas"
                                    className={`text-success me-1${
                                        documents.length ? "" : " invisible"
                                    }`}
                                />
                                Request Documents
                            </h5>
                        </div>
                        <div className="ms-auto">
                            <Button
                                variant="link"
                                onClick={toggleOpenRequestDoc}
                            >
                                {openRequestDoc
                                    ? "close"
                                    : documents.length
                                        ? "change"
                                        : "add"}
                            </Button>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className="ps-5">
                    <Collapse in={openRequestDoc}>
                        <div>
                            <LoadingOverlay
                                active={
                                    isUploading || isRemoving || requestLoading
                                }
                                spinner
                                text="Processing Documents..."
                                styles={{
                                    overlay: (base) => ({
                                        ...base,
                                        borderRadius: "12px",
                                    }),
                                }}
                            >
                                <Row>
                                    <Col lg={6}>
                                        {documents.length > 0 && (
                                            <>
                                                <h6>Attached Documents</h6>
                                                <ListGroup className="mb-3">
                                                    {documents.map((item) => (
                                                        <ListGroupItem
                                                            key={item.id}
                                                        >
                                                            <span className="float-start">
                                                                {item.name}
                                                            </span>
                                                            <Button
                                                                variant="link"
                                                                className="float-end p-0"
                                                                onClick={() => {
                                                                    removeDocument(
                                                                        item.id
                                                                    );
                                                                }}
                                                            >
                                                                <FapIcon icon="delete" />
                                                            </Button>
                                                        </ListGroupItem>
                                                    ))}
                                                </ListGroup>
                                            </>
                                        )}
                                        <div
                                            {...getRootProps({
                                                className:
                                                    "alert alert-green cursor-pointer border-3",
                                            })}
                                        >
                                            <input {...getInputProps()} />
                                            <p>
                                                Drag and drop files here or
                                                Click to select files
                                            </p>
                                        </div>
                                        {uploadFiles.length > 0 && (
                                            <>
                                                <ListGroup>
                                                    {uploadFiles.map((file) => (
                                                        <ListGroupItem
                                                            key={file.name}
                                                        >
                                                            <span className="float-start">
                                                                {file.name}
                                                            </span>
                                                            <Button
                                                                variant="link"
                                                                className="float-end p-0"
                                                                onClick={() => {
                                                                    removeUploadFile(
                                                                        file.name
                                                                    );
                                                                }}
                                                            >
                                                                <FapIcon icon="delete" />
                                                            </Button>
                                                        </ListGroupItem>
                                                    ))}
                                                </ListGroup>
                                                <Button
                                                    onClick={() => {
                                                        // setUploading(true);
                                                        doFileUpload();
                                                    }}
                                                    className="mt-3"
                                                >
                                                    Upload
                                                </Button>
                                            </>
                                        )}
                                        {fileError ? (
                                            <PageAlert
                                                className="mt-3"
                                                variant="warning"
                                                timeout={5000}
                                                dismissible
                                            >
                                                Error: {fileError}
                                            </PageAlert>
                                        ) : null}
                                    </Col>
                                </Row>
                            </LoadingOverlay>
                        </div>
                    </Collapse>
                    <Collapse in={!openRequestDoc}>
                        <div>
                            <Row className="mb-3">
                                <Col className="fw-bold" sm={3}>
                                    Attached Documents
                                </Col>
                                <Col>
                                    {documents.length > 0 ? (
                                        <p>
                                            {documents
                                                .map((item) => item.name)
                                                .join(", ")}
                                        </p>
                                    ) : (
                                        <Button
                                            variant="link"
                                            className="fst-italic p-0"
                                            onClick={toggleOpenRequestDoc}
                                        >
                                            Upload document(s)
                                            <FapIcon
                                                icon="angle-double-right"
                                                size="sm"
                                                className="ms-1"
                                            />
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                        </div>
                    </Collapse>
                </Card.Body>
            </Card>
        </>
    );
};

export default RequestDocForm;

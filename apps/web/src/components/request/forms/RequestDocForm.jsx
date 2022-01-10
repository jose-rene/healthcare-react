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
    FormGroup,
    FormCheck,
} from "react-bootstrap";
import LoadingOverlay from "react-loading-overlay";

import FapIcon from "components/elements/FapIcon";
import PageAlert from "components/elements/PageAlert";
import Textarea from "components/inputs/Textarea";

import useApiCall from "hooks/useApiCall";

/* eslint-disable react/no-array-index-key */

const RequestDocForm = ({
    requestId,
    documents,
    refreshRequest,
    requestLoading,
    saveRequest,
    hasNoDocuments,
    documentsReason,
    openRequestDoc,
    toggleOpenRequestDoc,
    disabled,
}) => {
    // dropzone
    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({});

    // instead of using onDrop, just let acceptedFiles handle that (it does not append more files added later)
    const [uploadFiles, setUploadFiles] = useState([]);
    const [{ isDocuments, documents_reason }, setIsDocuments] = useState({
        isDocuments: true,
        documents_reason: "",
    });

    useEffect(() => {
        setIsDocuments({
            isDocuments: !hasNoDocuments,
            documents_reason: documentsReason,
        });
    }, [hasNoDocuments, documentsReason]);

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
    const [{ error: fileError, loading: isUploading }, fileSubmit] = useApiCall(
        {
            method: "post",
            url: `request/${requestId}/document`,
        }
    );

    const handleFile = (selectedFile) => {
        const formData = new FormData();

        formData.append("file", selectedFile);
        formData.append("document_type_id", 1);
        formData.append("name", selectedFile.name);
        formData.append("mime_type", selectedFile.type);

        return fileSubmit({ params: formData });
    };

    const handleNoDocs = (e) => {
        const { checked } = e.target;
        setIsDocuments((prev) => ({ ...prev, isDocuments: checked }));
    };

    const doFileUpload = async () => {
        const promises = uploadFiles.map(async (item) => {
            const result = await handleFile(item);
            return result;
        });
        // wait for all promises to resolve
        await Promise.all(promises);
        // clear dropzone files
        setUploadFiles([]);
        // refresh the request
        refreshRequest("doc");
    };

    const onReasonChange = (e) => {
        const { value } = e.target;
        setIsDocuments((prev) => ({
            ...prev,
            documents_reason: value || "",
        }));
    };

    const submitReason = () => {
        if (!documents_reason) {
            return;
        }
        saveRequest({ documents_reason, type_name: "no-documents" });
    };

    return (
        <>
            <Card
                className={`border-1 border-top-0 border-end-0 border-start-0 bg-light mt-3${
                    disabled ? " disabled" : ""
                }`}
            >
                <Card.Header className="border-0 bg-light ps-0">
                    <div className="d-flex">
                        <div>
                            <h5>
                                <FapIcon
                                    icon="check-circle"
                                    type="fas"
                                    className={`text-success me-3${
                                        documents.length || hasNoDocuments
                                            ? ""
                                            : " invisible"
                                    }`}
                                />
                                Documents
                            </h5>
                        </div>
                        <div className="ms-auto">
                            {!openRequestDoc && (
                                <Button
                                    variant="link"
                                    onClick={toggleOpenRequestDoc}
                                >
                                    {documents.length ? "change" : "add"}
                                </Button>
                            )}
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
                                    <Col>
                                        {documents.length === 0 &&
                                            uploadFiles.length === 0 && (
                                                <FormGroup
                                                    className="mb-3"
                                                    controlId="formBasicEmail"
                                                >
                                                    <FormCheck
                                                        type="checkbox"
                                                        label="I am uploading documents"
                                                        checked={isDocuments}
                                                        onClick={handleNoDocs}
                                                    />
                                                </FormGroup>
                                            )}
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
                                        {isDocuments && (
                                            <div
                                                {...getRootProps({
                                                    className:
                                                        "alert alert-success cursor-pointer border-3",
                                                })}
                                            >
                                                <input {...getInputProps()} />
                                                <p>
                                                    Drag and drop files here or
                                                    Click to select files
                                                </p>
                                            </div>
                                        )}
                                        {!isDocuments && (
                                            <>
                                                <Textarea
                                                    label="Reason for no documents"
                                                    id="documents_reason"
                                                    name="documents_reason"
                                                    type="textarea"
                                                    rows={5}
                                                    value={documents_reason}
                                                    onChange={onReasonChange}
                                                />
                                                <Button
                                                    variant="secondary"
                                                    onClick={
                                                        toggleOpenRequestDoc
                                                    }
                                                    className="me-3 mb-2"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        submitReason();
                                                    }}
                                                    className="mb-2"
                                                >
                                                    Save
                                                </Button>
                                            </>
                                        )}
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
                                                    variant="secondary"
                                                    onClick={
                                                        toggleOpenRequestDoc
                                                    }
                                                    className="me-3 mt-3"
                                                >
                                                    Cancel
                                                </Button>
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
                                    {hasNoDocuments
                                        ? "No Documents"
                                        : "Attached Documents"}
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

import React, { useState, useEffect, useCallback } from "react";
import {
    Button,
    Card,
    Col,
    Collapse,
    Row,
    FloatingLabel,
    Form,
    ListGroup,
    ListGroupItem,
} from "react-bootstrap";
import AsyncSelect from "react-select/async";
import FapIcon from "components/elements/FapIcon";
import useApiCall from "hooks/useApiCall";
import PageAlert from "components/elements/PageAlert";
import LoadingOverlay from "react-loading-overlay";
import debounce from "lodash/debounce";
/* eslint-disable react/no-array-index-key */

const RequestInfoForm = ({
    auth_number,
    requestCodes,
    openRequestInfo,
    toggleOpenRequestInfo,
    saveRequest,
    requestLoading,
    updateError,
}) => {
    const [data, setData] = useState({
        type_name: "diagnosis",
        codes: [],
        auth_number: auth_number ?? "",
    });

    // const [auth_number, setAuthNumber] = useState("");
    const [codes, setCodes] = useState([]);

    const handleAuthChange = (auth_number) => {
        setData((prevData) => {
            return { ...prevData, auth_number };
        });
    };

    const updateData = (codeData) => {
        setCodes(codeData);
        setData((prevData) => {
            return {
                ...prevData,
                codes: codeData.filter((item) => item.code !== ""),
            };
        });
    };

    // set params when diagnosis codes change
    /* useEffect(() => {
        setParams(data);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]); */

    useEffect(() => {
        // console.log(requestCodes);
        if (requestCodes?.length) {
            updateData(requestCodes);
        }
        // add a blank field
        setCodes((prevCodes) => [
            ...prevCodes,
            {
                code: "",
                description: "",
            },
        ]);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [{ loading }, fireSearch] = useApiCall({
        method: "get",
        url: "icd10code/lookup",
    });

    const lookupCodes = (input, callback) => {
        if (input.length < 2 || loading) {
            return null;
        }
        fireSearch({ params: { term: input.trim() } }).then((options) => {
            // console.log(options);
            callback(options);
        });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const lookup = useCallback(debounce(lookupCodes, 1300), []);

    const handleCodeChange = (selected, action, index) => {
        const [...currentCodes] = codes;
        if (!currentCodes[index]) {
            return;
        }
        if (action?.action && action.action === "clear") {
            // may just remove all together
            if (
                currentCodes.length > 1 &&
                index !== currentCodes.length - 1 &&
                currentCodes[currentCodes.length - 1].code === ""
            ) {
                currentCodes.splice(index, 1);
            } else {
                // simply clear
                currentCodes[index] = {
                    code: "",
                    description: "",
                };
            }
        } else {
            currentCodes[index] = {
                code: selected.value,
                description: selected.label,
            };
            // append another input if necessary
            if (index === currentCodes.length - 1) {
                currentCodes.push({
                    code: "",
                    description: "",
                });
            }
        }
        updateData(currentCodes);
    };
    const handleSave = () => {
        console.log(data);
        saveRequest(data);
    };
    const filled = requestCodes.length && auth_number;

    return (
        <>
            <Card className="border-1 border-top-0 border-end-0 border-start-0 bg-light mt-3">
                <Card.Header className="border-0 bg-light ps-0">
                    <div className="d-flex">
                        <div>
                            <h5>
                                <FapIcon
                                    icon="check-circle"
                                    type="fas"
                                    className={`text-success me-3${
                                        filled ? "" : " invisible"
                                    }`}
                                />
                                Request Info
                            </h5>
                        </div>
                        <div className="ms-auto">
                            {!openRequestInfo && (
                                <Button
                                    variant="link"
                                    onClick={toggleOpenRequestInfo}
                                >
                                    {filled ? "change" : "add"}
                                </Button>
                            )}
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className="ps-5 pb-0">
                    <Collapse in={openRequestInfo}>
                        <div>
                            {updateError && (
                                <PageAlert
                                    variant="warning"
                                    dismissible
                                    timeout={6000}
                                >
                                    {updateError}
                                </PageAlert>
                            )}
                            <LoadingOverlay
                                active={requestLoading}
                                spinner
                                text="Updating..."
                                styles={{
                                    overlay: (base) => ({
                                        ...base,
                                        borderRadius: "12px",
                                    }),
                                }}
                            >
                                <Row>
                                    <Col xl={8} lg={10}>
                                        <Row>
                                            <Col md="12" className="mb-3">
                                                <FloatingLabel
                                                    controlId="auth_number"
                                                    label="Unique Assessment ID"
                                                >
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Unique Assessment ID"
                                                        autoComplete="off"
                                                        value={data.auth_number}
                                                        onChange={(e) =>
                                                            handleAuthChange(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                            <Col md="12">
                                                <p className="title-info">
                                                    Relevant Diagnosis
                                                    (required)
                                                </p>
                                                <p
                                                    className="subtitle-info"
                                                    style={{ color: "#475866" }}
                                                >
                                                    Enter the first letter and
                                                    number of the ICD-10 code or
                                                    at least the first 2
                                                    characters of the
                                                    description. ICD-9 is no
                                                    longer supported.
                                                </p>
                                            </Col>
                                            {codes.map((item, index) => (
                                                <Col
                                                    md={12}
                                                    className="mb-3"
                                                    key={`diag_${index}`}
                                                >
                                                    <h6>
                                                        Relelvant Diagnosis{" "}
                                                        {index + 1}
                                                    </h6>
                                                    <AsyncSelect
                                                        name={`icd10_lookup_${index}`}
                                                        placeholder="Type in the first few letters of code or description"
                                                        loadOptions={lookup}
                                                        isClearable
                                                        value={
                                                            item.code
                                                                ? {
                                                                      label: item.description,
                                                                      value: item.code,
                                                                  }
                                                                : null
                                                        }
                                                        isLoading={loading}
                                                        styles={{
                                                            // Fixes the overlapping problem of the component
                                                            menu: (
                                                                provided
                                                            ) => ({
                                                                ...provided,
                                                                zIndex: 9999,
                                                            }),
                                                        }}
                                                        onChange={(
                                                            selected,
                                                            action
                                                        ) =>
                                                            handleCodeChange(
                                                                selected,
                                                                action,
                                                                index
                                                            )
                                                        }
                                                    />
                                                </Col>
                                            ))}
                                        </Row>
                                        <Row>
                                            <Col className="mb-3">
                                                <Button
                                                    variant="secondary"
                                                    onClick={
                                                        toggleOpenRequestInfo
                                                    }
                                                    className="me-3"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button onClick={handleSave}>
                                                    Save
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </LoadingOverlay>
                        </div>
                    </Collapse>
                    <Collapse in={!openRequestInfo}>
                        <div>
                            <Row className="mb-3">
                                <Col className="fw-bold" sm={3}>
                                    Unique Assessment ID
                                </Col>
                                <Col>
                                    {auth_number || (
                                        <Button
                                            variant="link"
                                            className="fst-italic p-0"
                                            onClick={toggleOpenRequestInfo}
                                        >
                                            Enter assessment ID
                                            <FapIcon
                                                icon="angle-double-right"
                                                size="sm"
                                                className="ms-1"
                                            />
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col>
                                    {codes?.length && codes[0].code ? (
                                        <ListGroup className="mb-3">
                                            <ListGroup.Item className="bg-light">
                                                <h6 className="mb-0">
                                                    Relevant Diagnosis
                                                </h6>
                                            </ListGroup.Item>
                                            {codes.map(
                                                (item) =>
                                                    item.description && (
                                                        <ListGroupItem
                                                            key={
                                                                item.description
                                                            }
                                                        >
                                                            {item.description}
                                                        </ListGroupItem>
                                                    )
                                            )}
                                        </ListGroup>
                                    ) : (
                                        <Button
                                            variant="link"
                                            className="fst-italic p-0"
                                            onClick={toggleOpenRequestInfo}
                                        >
                                            Enter diagnosis
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

export default RequestInfoForm;

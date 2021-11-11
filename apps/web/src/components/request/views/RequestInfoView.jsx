import React, { useState, useEffect, useCallback } from "react";
import { Button, Card, Col, Collapse, Row } from "react-bootstrap";
import AsyncSelect from "react-select/async";
import FapIcon from "components/elements/FapIcon";
import useApiCall from "hooks/useApiCall";
import PageAlert from "components/elements/PageAlert";
import LoadingOverlay from "react-loading-overlay";
import debounce from "lodash/debounce";
/* eslint-disable react/no-array-index-key */

const RequestInfoView = ({
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
    });

    // const [auth_number, setAuthNumber] = useState("");
    const [codes, setCodes] = useState([]);

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
    // const filled = requestCodes.length && auth_number;

    return (
        <>
            <Card className="border-1 border-top-0 border-end-0 border-start-0 bg-light mt-3">
                <Card.Header className="border-0 bg-light ps-2">
                    <div className="d-flex">
                        <div>
                            <h5 className="ms-2">Request Info</h5>
                        </div>
                        <div className="ms-auto">
                            {!openRequestInfo && (
                                <Button
                                    variant="link"
                                    onClick={toggleOpenRequestInfo}
                                >
                                    add diagnosis
                                </Button>
                            )}
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className="px-3">
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
                                    <Col lg={6}>
                                        <Row>
                                            <Col md={12}>
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
                                <Col className="fw-bold" sm={3}>
                                    Relevant Diagnosis
                                </Col>
                                <Col>
                                    {codes?.length && codes[0].code ? (
                                        <p>
                                            {codes
                                                .map((item) => item.description)
                                                .filter((item) => item)
                                                .join(", ")}
                                        </p>
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

export default RequestInfoView;

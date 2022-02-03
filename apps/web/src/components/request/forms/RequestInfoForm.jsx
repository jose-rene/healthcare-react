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
    InputGroup,
} from "react-bootstrap";
import AsyncSelect from "react-select/async";
import Select2 from "react-select";
import FapIcon from "components/elements/FapIcon";
import useApiCall from "hooks/useApiCall";
import PageAlert from "components/elements/PageAlert";
import LoadingOverlay from "react-loading-overlay";
import debounce from "lodash/debounce";
/* eslint-disable react/no-array-index-key */

const RequestInfoForm = ({
    auth_number,
    auth_verified = false,
    requestCodes,
    openRequestInfo,
    toggleOpenRequestInfo,
    saveRequest,
    payerProfile: { classifications: payerClassifications = [] },
    classificationId,
    requestLoading,
    updateError,
}) => {
    const [data, setData] = useState({
        type_name: "diagnosis",
        codes: [],
        auth_number: "",
        auth_verified: false,
        classification_id: "",
    });

    // const [auth_number, setAuthNumber] = useState("");
    const [codes, setCodes] = useState([]);

    const [classification, setClassification] = useState({
        options: [],
        value: "",
    });

    const handleAuthChange = (auth_number) => {
        setData((prevData) => {
            return { ...prevData, auth_number };
        });
    };

    const handleClassification = (selected, action) => {
        if (action?.action === "clear") {
            setData((prevData) => ({ ...prevData, classification_id: "" }));
            setClassification((prev) => ({ ...prev, value: "" }));
            return;
        }
        const value = selected?.value ?? null;
        setData((prevData) => ({
            ...prevData,
            classification_id: value,
        }));
        setClassification((prev) => ({ ...prev, value }));
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

    const mapOptions = (values) => {
        if (!values) {
            return [];
        }
        const options = values.map((item) => {
            return { label: item.name, value: item.id };
        });
        return options;
    };

    const getClassification = (value) => {
        const selected = payerClassifications.find((item) => item.id === value);
        return selected ? selected.name : "n/a";
    };

    useEffect(() => {
        setData({
            type_name: "diagnosis",
            codes: [],
            auth_number: auth_number ?? "",
            auth_verified,
            classification_id: classificationId ?? "",
        });
    }, [auth_number, auth_verified, classificationId]);

    useEffect(() => {
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
    }, [requestCodes]);

    useEffect(() => {
        // set classfications
        setClassification({
            options: mapOptions(payerClassifications ?? []),
            value: classificationId,
        });
    }, [payerClassifications, classificationId]);

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
    const lookup = useCallback(debounce(lookupCodes, 500), []);

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
        // console.log(data);
        saveRequest(data);
    };
    const handleAuthSave = () => {
        if (!data.auth_number) {
            return;
        }
        saveRequest({
            type_name: "auth-id",
            auth_number: data.auth_number,
            classification_id: data.classification_id,
        })
            .then(() => setData((prev) => ({ ...prev, auth_verified: true })))
            .catch(() =>
                setData((prev) => ({ ...prev, auth_verified: false }))
            );
    };
    const filled = requestCodes.length && auth_number && classificationId;

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
                                            <Col className="mb-3">
                                                <Select2
                                                    className="basic-single mt-2"
                                                    classNamePrefix="select"
                                                    defaultValue=""
                                                    isClearable
                                                    isSearchable
                                                    name="payerClassifications"
                                                    options={
                                                        classification.options
                                                    }
                                                    value={
                                                        classification.value
                                                            ? classification.options.find(
                                                                  (opt) =>
                                                                      opt.value ===
                                                                      classification.value
                                                              )
                                                            : null
                                                    }
                                                    onChange={
                                                        handleClassification
                                                    }
                                                    placeholder="Select Classification..."
                                                />
                                            </Col>
                                        </Row>
                                        {!!classification?.value && (
                                            <Row>
                                                <Col md="12" className="mb-3">
                                                    <InputGroup className="mb-3 w-100">
                                                        {data.auth_verified && (
                                                            <InputGroup.Text>
                                                                <FapIcon
                                                                    icon="check-circle"
                                                                    type="fas"
                                                                    className="text-success"
                                                                />
                                                            </InputGroup.Text>
                                                        )}
                                                        <FloatingLabel
                                                            controlId="auth_number"
                                                            label="Assessment ID*"
                                                        >
                                                            <Form.Control
                                                                type="text"
                                                                className="rounded-0"
                                                                placeholder="Assessment ID"
                                                                autoComplete="off"
                                                                value={
                                                                    data.auth_number
                                                                }
                                                                onChange={(e) =>
                                                                    handleAuthChange(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </FloatingLabel>
                                                        <Button
                                                            variant="outline-success"
                                                            id="button-addon2"
                                                            onClick={
                                                                handleAuthSave
                                                            }
                                                        >
                                                            Verify
                                                            <FapIcon icon="check-circle" />
                                                        </Button>
                                                    </InputGroup>
                                                </Col>
                                                {!!classification?.value &&
                                                    data.auth_verified && (
                                                        <>
                                                            <Col md="12">
                                                                <p className="title-info">
                                                                    Relevant
                                                                    Diagnosis
                                                                    (required)
                                                                </p>
                                                                <p
                                                                    className="subtitle-info"
                                                                    style={{
                                                                        color: "#475866",
                                                                    }}
                                                                >
                                                                    Enter the
                                                                    first letter
                                                                    and number
                                                                    of the
                                                                    ICD-10 code
                                                                    or at least
                                                                    the first 2
                                                                    characters
                                                                    of the
                                                                    description.
                                                                    ICD-9 is no
                                                                    longer
                                                                    supported.
                                                                </p>
                                                            </Col>
                                                            {codes.map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => (
                                                                    <Col
                                                                        md={12}
                                                                        className="mb-3"
                                                                        key={`diag_${index}`}
                                                                    >
                                                                        <h6>
                                                                            Relelvant
                                                                            Diagnosis
                                                                            {index +
                                                                                1}
                                                                        </h6>
                                                                        <AsyncSelect
                                                                            name={`icd10_lookup_${index}`}
                                                                            placeholder="Type in the first few letters of code or description"
                                                                            loadOptions={
                                                                                lookup
                                                                            }
                                                                            isClearable
                                                                            value={
                                                                                item.code
                                                                                    ? {
                                                                                          label: item.description,
                                                                                          value: item.code,
                                                                                      }
                                                                                    : null
                                                                            }
                                                                            isLoading={
                                                                                loading
                                                                            }
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
                                                                )
                                                            )}
                                                        </>
                                                    )}
                                            </Row>
                                        )}
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
                                                {!!classification?.value &&
                                                    data.auth_verified && (
                                                        <Button
                                                            onClick={handleSave}
                                                        >
                                                            Save
                                                        </Button>
                                                    )}
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
                                    Classification
                                </Col>
                                <Col>
                                    {classificationId ? (
                                        getClassification(classificationId)
                                    ) : (
                                        <Button
                                            variant="link"
                                            className="fst-italic p-0"
                                            onClick={toggleOpenRequestInfo}
                                        >
                                            Select Classification
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
                                    Assessment ID
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

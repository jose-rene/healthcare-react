import React, { useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import AsyncSelect from "react-select/async";
import useApiCall from "hooks/useApiCall";
import PageAlert from "components/elements/PageAlert";
import LoadingOverlay from "react-loading-overlay";
import debounce from "lodash/debounce";

const DiagnosisForm = ({
    diagnosisCodes,
    toggleDiagnosis,
    requestId,
    refreshAssessment,
    refreshLoading,
}) => {
    const [data, setData] = useState({
        type_name: "diagnosis-only",
        codes: [],
    });

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

    useEffect(() => {
        // console.log(diagnosisCodes);
        if (diagnosisCodes?.length) {
            updateData(diagnosisCodes);
        }
        // add a blank field
        setCodes((prevCodes) => [
            ...prevCodes,
            {
                code: "",
                description: "",
            },
        ]);
    }, [diagnosisCodes]);

    const [{ loading }, fireSearch] = useApiCall({
        method: "get",
        url: "icd10code/lookup",
    });

    const lookupCodes = (input, callback) => {
        if (input.length < 2 || loading) {
            return null;
        }
        fireSearch({ params: { term: input.trim() } })
            .then((options) => {
                // console.log(options);
                callback(options);
            })
            .catch((e) => {
                console.log(e);
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

    const [{ loading: updateLoading, error: updateError }, updateDiagnosis] =
        useApiCall({
            method: "put",
            url: `assessment/${requestId}/diagnosis`,
        });
    const handleSave = () => {
        updateDiagnosis({ params: data })
            .then(() => refreshAssessment("diagnosis"))
            .catch((e) => console.log(e));
    };

    return (
        <div>
            {updateError && (
                <PageAlert variant="warning" dismissible timeout={6000}>
                    {updateError}
                </PageAlert>
            )}
            <LoadingOverlay
                active={refreshLoading || updateLoading}
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
                                    Relevant Diagnosis (required)
                                </p>
                                <p
                                    className="subtitle-info"
                                    style={{ color: "#475866" }}
                                >
                                    Enter the first letter and number of the
                                    ICD-10 code or at least the first 2
                                    characters of the description. ICD-9 is no
                                    longer supported.
                                </p>
                            </Col>
                            {codes.map((item, index) => (
                                <Col
                                    md={12}
                                    className="mb-3"
                                    key={`diag_${index}`}
                                >
                                    <h6>Relelvant Diagnosis {index + 1}</h6>
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
                                            menu: (provided) => ({
                                                ...provided,
                                                zIndex: 9999,
                                            }),
                                        }}
                                        onChange={(selected, action) =>
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
                                    onClick={() => toggleDiagnosis(false)}
                                    className="me-3"
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleSave}>Save</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </LoadingOverlay>
        </div>
    );
};

export default DiagnosisForm;

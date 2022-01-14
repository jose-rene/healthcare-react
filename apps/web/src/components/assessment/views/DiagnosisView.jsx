import React from "react";
import { Button, Card, Collapse, ListGroup } from "react-bootstrap";

import DiagnosisForm from "../forms/DiagnosisForm";

const DiagnosisView = ({
    openDiagnosis,
    toggleDiagnosis,
    diagnosisCodes,
    requestId,
    refreshAssessment,
    refreshLoading,
}) => {
    return (
        <>
            <Card className="border-1 border-top-0 border-end-0 border-start-0 bg-light mb-3">
                <Card.Header className="bg-light border-0 ps-2">
                    <div className="d-flex">
                        <div>
                            <h5 className="ms-2">Relevant Diagnosis</h5>
                        </div>
                        <div className="ms-auto">
                            {!openDiagnosis && (
                                <Button
                                    variant="link"
                                    onClick={toggleDiagnosis}
                                >
                                    add diagnosis
                                </Button>
                            )}
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Collapse in={openDiagnosis}>
                        <div>
                            <DiagnosisForm
                                {...{
                                    diagnosisCodes,
                                    toggleDiagnosis,
                                    refreshAssessment,
                                    refreshLoading,
                                    requestId,
                                }}
                            />
                        </div>
                    </Collapse>
                    <Collapse in={!openDiagnosis}>
                        <div>
                            {diagnosisCodes?.length &&
                            diagnosisCodes[0].code ? (
                                <ListGroup className="mb-3">
                                    {diagnosisCodes.map(
                                        ({ id, description }) =>
                                            description && (
                                                <ListGroup.Item key={id}>
                                                    {description}
                                                </ListGroup.Item>
                                            )
                                    )}
                                </ListGroup>
                            ) : null}
                        </div>
                    </Collapse>
                </Card.Body>
            </Card>
        </>
    );
};

export default DiagnosisView;

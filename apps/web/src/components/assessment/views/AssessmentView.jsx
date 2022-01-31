/* eslint-disable jsx-a11y/anchor-is-valid */
import FapIcon from "components/elements/FapIcon";
import React, { useEffect, useState } from "react";
import { Button, Card, Collapse } from "react-bootstrap";

import ShowFormSection from "../ShowFormSection";
import AssessmentSectionHeader from "./AssessmentSectionHeader";

const AssessmentView = ({
    forms,
    assessmentName,
    requestId,
    getFormStatus,
    openAssessment,
    toggleAssessment,
    valid,
}) => {
    const [formToggle, setFormToggle] = useState([]);
    useEffect(() => {
        setFormToggle(new Array(forms.length).fill(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleForm = (index) => {
        const toggle = [...formToggle];
        const value = toggle[index];
        toggle.fill(false);
        toggle[index] = !value;
        setFormToggle(toggle);
    };

    const isFormOpen = (index) => {
        return formToggle[index];
    };

    const handleOnSubmit = (formIndex) => {
        if (forms.length === formIndex) {
            return true;
        }

        toggleForm(formIndex + 1);
    };

    return (
        <>
            <Card className="border-1 border-top-0 border-end-0 border-start-0 bg-light mb-3">
                <Card.Header className="bg-light border-0 ps-0">
                    <div className="d-flex">
                        <div>
                            <h5 className={`${valid ? "" : " text-danger"}`}>
                                <FapIcon
                                    icon="check-circle"
                                    type="fas"
                                    className={`text-success ms-n3 me-1${
                                        valid ? "" : " invisible"
                                    }`}
                                />
                                {assessmentName}
                            </h5>
                        </div>
                        <div className="ms-auto">
                            <Button
                                variant="link"
                                className="fst-italic p-0"
                                onClick={() =>
                                    toggleAssessment(!openAssessment)
                                }
                            >
                                {`${
                                    openAssessment ? "close" : "open"
                                } assessment`}
                                <FapIcon
                                    icon="angle-double-right"
                                    size="sm"
                                    className="ms-1"
                                />
                            </Button>
                        </div>
                    </div>
                </Card.Header>
                {openAssessment && (
                    <Card.Body>
                        {forms.map(({ slug, name }, formIndex) => (
                            <Card
                                key={slug}
                                className="border-1 border-0 bg-light mb-3"
                            >
                                <Card.Header className="bg-light border-0 py-0 ps-0">
                                    <h5 className="">
                                        <FapIcon
                                            icon="check-circle"
                                            type="fas"
                                            className={`text-success ms-n3 me-1${
                                                getFormStatus(slug)
                                                    ? ""
                                                    : " invisible"
                                            }`}
                                        />
                                        <a
                                            className="d-inline text-decoration-none"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleForm(formIndex);
                                            }}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <FapIcon
                                                icon={
                                                    isFormOpen(formIndex)
                                                        ? "minus"
                                                        : "plus"
                                                }
                                                size="sm"
                                                className="me-1 flex-grow-0"
                                            />
                                            <AssessmentSectionHeader
                                                sectionName={slug}
                                                title={name}
                                            />
                                        </a>
                                    </h5>
                                </Card.Header>
                                <Card.Body className="pt-0">
                                    <Collapse in={isFormOpen(formIndex)}>
                                        <div>
                                            <ShowFormSection
                                                key={slug}
                                                requestId={requestId}
                                                formSlug={slug}
                                                name={name}
                                                onSubmit={() =>
                                                    handleOnSubmit(formIndex)
                                                }
                                            />
                                        </div>
                                    </Collapse>
                                </Card.Body>
                            </Card>
                        ))}
                    </Card.Body>
                )}
            </Card>
        </>
    );
};

export default AssessmentView;

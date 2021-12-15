/* eslint-disable jsx-a11y/anchor-is-valid */
import FapIcon from "components/elements/FapIcon";
import React, { useEffect, useState } from "react";
import { Button, Card, Collapse, Row, Col } from "react-bootstrap";

import ShowFormSection from "../ShowFormSection";

const AssessmentView = ({ forms, assessmentName, requestId }) => {
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

    return (
        <>
            <Card className="border-1 border-top-0 border-end-0 border-start-0 bg-light mb-3">
                <Card.Header className="bg-light border-0 ps-2">
                    <div className="d-flex">
                        <div>
                            <h5 className="ms-2">{assessmentName}</h5>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    {forms.map(({ slug, name }, formIndex) => (
                        <Card
                            key={slug}
                            className="border-1 border-0 bg-light mb-3"
                        >
                            <Card.Header className="bg-light border-0 py-0">
                                <div className="d-flex">
                                    <div>
                                        <h5 className="ms-2">
                                            <a
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
                                                    className="me-1"
                                                />
                                                {name}
                                            </a>
                                        </h5>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body className="pt-0">
                                <Collapse in={isFormOpen(formIndex)}>
                                    <div>
                                        <ShowFormSection
                                            key={slug}
                                            requestId={requestId}
                                            formSlug={slug}
                                            name={name}
                                        />
                                    </div>
                                </Collapse>
                            </Card.Body>
                        </Card>
                    ))}
                </Card.Body>
            </Card>
        </>
    );
};

export default AssessmentView;

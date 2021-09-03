import React from "react";
import { Button, Card, Col, Collapse, Row } from "react-bootstrap";
import FapIcon from "components/elements/FapIcon";

const MemberInfoForm = ({ memberData, openMember, toggleOpenMember }) => {
    return (
        <>
            <Card className="border-1">
                <Card.Header className="bg-white border-0 ps-2">
                    <div className="d-flex">
                        <div>
                            <h5>
                                <FapIcon
                                    icon="check-circle"
                                    type="fas"
                                    className="text-success me-1"
                                />
                                Member Info
                            </h5>
                        </div>
                        <div className="ms-auto">
                            <Button variant="link" onClick={toggleOpenMember}>
                                {openMember ? "close" : "change"}
                            </Button>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className="ps-5">
                    <Collapse in={openMember}>
                        <div>
                            <Row>
                                <Col lg={6}>
                                    <h6>[Member Edit Form Here]</h6>
                                </Col>
                            </Row>
                        </div>
                    </Collapse>
                    <Collapse in={!openMember}>
                        <div>
                            <Row className="mb-3">
                                <Col className="fw-bold" sm={3}>
                                    Address
                                </Col>
                                <Col>{`${memberData.address.address_1} ${memberData.address.address_2} ${memberData.address.city}, ${memberData.address.state} ${memberData.address.postal_code}`}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col className="fw-bold" sm={3}>
                                    Phone
                                </Col>
                                <Col>{memberData.phone.number}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col className="fw-bold" sm={3}>
                                    Plan
                                </Col>
                                <Col>{memberData.payer.company_name}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col className="fw-bold" sm={3}>
                                    Line of Business
                                </Col>
                                <Col>{memberData.lob.name}</Col>
                            </Row>
                            <Row>
                                <Col className="fw-bold" sm={3}>
                                    Member ID
                                </Col>
                                <Col>{memberData.member_number}</Col>
                            </Row>
                        </div>
                    </Collapse>
                </Card.Body>
            </Card>
        </>
    );
};

export default MemberInfoForm;

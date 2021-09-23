import React, { useState } from "react";
import { Button, Card, Col, Collapse, Row } from "react-bootstrap";
import Form from "components/elements/Form";
import * as Yup from "yup";
import useApiCall from "hooks/useApiCall";
import LoadingOverlay from "react-loading-overlay";
import MemberForm from "../MemberForm";

const MemberInfoView = ({
    memberData,
    openMember,
    toggleOpenMember,
    refreshRequest,
    requestLoading,
}) => {
    const {
        // eslint-disable-next-line react/prop-types
        address: { address_1, address_2, city, county, state, postal_code },
        phone: { number: phone_number },
        payer,
        lob,
        member_number,
        id: memberId,
    } = memberData;

    const [defaultData, setDefaultData] = useState({
        address_1,
        address_2,
        city,
        county,
        state,
        postal_code,
        phone: phone_number,
        member_number,
        line_of_business: lob?.id ?? "",
        plan: payer?.id ?? "",
    });

    const validation = {
        phone: {
            yupSchema: Yup.string().trim().required("Phone number is required"),
            // .matches(/^[0-9]{10}$/, "A 10-digit phone number is required"),
        },
        member_number: {
            yupSchema: Yup.string().required("Member ID is required"),
        },
        line_of_business: {
            yupSchema: Yup.string().required("Line of Business is required"),
        },
        address_1: {
            yupSchema: Yup.string().required("Address 1 is required"),
        },
        city: {
            yupSchema: Yup.string().required("City is required"),
        },
        state: {
            yupSchema: Yup.string().required("State is required"),
        },
        postal_code: {
            yupSchema: Yup.string().required("Postal Code is required"),
        },
    };

    // api call to update request
    const [{ loading: memberLoading }, updateMember] = useApiCall({
        method: "put",
        url: `member/${memberId}`,
    });

    const handleSave = async (formData) => {
        // the api call will set loading, rerending page, context form will re-render with defaultData, has to be set here
        setDefaultData((...prevData) => ({ ...prevData, ...formData }));
        // check if address is updated
        const { address } = memberData;
        const addressKeys = Object.keys(address);
        let dirty = false;
        addressKeys.forEach((item) => {
            dirty =
                dirty ||
                (formData[item] != null && formData[item] !== address[item]);
        });
        // only save address if changed
        if (!dirty) {
            // exclude address from changes
            addressKeys.forEach((item) => {
                delete formData[item];
            });
        }
        try {
            const result = await updateMember({ params: formData });
            refreshRequest("member");
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <>
            <Card className="border-1 border-top-0 border-end-0 border-start-0 bg-light">
                <Card.Header className="bg-light border-0 ps-2">
                    <div className="d-flex">
                        <div>
                            <h5 className="ms-2">Member Info</h5>
                        </div>
                        <div className="ms-auto">
                            {!openMember && (
                                <Button
                                    variant="link"
                                    onClick={toggleOpenMember}
                                >
                                    edit contact
                                </Button>
                            )}
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className="px-3">
                    <Collapse in={openMember}>
                        <div>
                            <LoadingOverlay
                                active={memberLoading || requestLoading}
                                spinner
                                text="Updating Member..."
                                styles={{
                                    overlay: (base) => ({
                                        ...base,
                                        borderRadius: "12px",
                                    }),
                                }}
                            >
                                <Row>
                                    <Col lg={9}>
                                        <Form
                                            validation={validation}
                                            onSubmit={handleSave}
                                            defaultData={defaultData}
                                        >
                                            <MemberForm payer={payer} />
                                            <Row>
                                                <Col>
                                                    <Button
                                                        variant="secondary"
                                                        onClick={
                                                            toggleOpenMember
                                                        }
                                                        className="me-3"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button type="submit">
                                                        Save
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Col>
                                </Row>
                            </LoadingOverlay>
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

export default MemberInfoView;

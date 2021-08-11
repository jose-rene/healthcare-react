import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import Icon from "components/elements/Icon";
import { Button } from "components";

const AddUser = ({ location }) => {
    return (
        <div className="content-box">
            <div className="col-12">
                <div className="row">
                    <div className="col-12">
                        <div className="row row-no-margin">
                            <div className="col-12 col-lg-4 p-0 d-flex">
                                <Button onClick={() => location.push("/contacts")} variant="outline-secondary">
                                    <Icon icon="plane" style={{ fontSize: 16 }} /> <p
                                    className="p-0 m-0 d-inline">Back</p>
                                </Button>
                                <h1 className="box-title mb-1 me-4 ps-4">Contact Details</h1>
                            </div>

                            <div className="col-12 col-lg-8 p-0 row row-no-margin customAlignButtonsContactDetailsHealthPlan">
                                <div className="buttonResendEmail">
                                    <Button variant="secondary"
                                            className="me-md-3 no-break-content custom-secondary-button-companies widthFullDetailsPatient"><Icon
                                        className="me-2" icon={"paper-plane"} style={{ fontSize: 16 }} /> Resend
                                        Email</Button>
                                </div>
                                <div className="buttonSendReset">
                                    <Button variant="secondary"
                                            className="me-md-3 no-break-content custom-secondary-button-companies widthFullDetailsPatient"><Icon
                                        icon="refresh" className="me-2" style={{ fontSize: 16 }} /> Send Reset
                                        Email</Button>
                                </div>
                                <div className="buttonDeactivate">
                                    <Button variant="secondary"
                                            className="me-md-3 no-break-content custom-secondary-button-companies widthFullDetailsPatient"><Icon
                                        icon="power" className="me-2" style={{ fontSize: 16 }} /> Deactivate</Button>
                                </div>
                                <div className="buttonSetPassword">
                                    <Button variant="secondary"
                                            className="me-md-3 no-break-content custom-secondary-button-companies widthFullDetailsPatient"><Icon
                                        icon="lock" className="me-2" style={{ fontSize: 16 }} /> Set Password</Button>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-5 tabs-contactDetails">
                            <div className="col-12 p-0">
                                <Tabs
                                    defaultActiveKey="contact-info"
                                    id="uncontrolled-tab-example"
                                >
                                    <Tab
                                        tabClassName="custom-bootstrap-tab"
                                        eventKey="contact-info"
                                        title="Contact Info"
                                    >
                                        {/*<ContactInfo />*/}
                                    </Tab>
                                    <Tab
                                        tabClassName="custom-bootstrap-tab"
                                        eventKey="narrative-reports-submission"
                                        title="Narrative Reports Submission"
                                    >
                                        {/*<NarrativeReports />*/}
                                    </Tab>
                                    <Tab
                                        tabClassName="custom-bootstrap-tab"
                                        eventKey="messages"
                                        title="Messages"
                                    >
                                        {/*<Messages />*/}
                                    </Tab>
                                    <Tab
                                        tabClassName="custom-bootstrap-tab"
                                        eventKey="access-log"
                                        title="Access Log"
                                    >
                                        {/*<AccessLog />*/}
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddUser;

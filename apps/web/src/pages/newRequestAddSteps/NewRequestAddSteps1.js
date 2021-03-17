import React from "react";
import Switch from "../../components/switch/Switch";
import Modal from "../../components/modal/Modal";
import "./newRequestAddSteps.css";

const NewRequestAddSteps1 = () => (
    <>
        <div className="container-info">
            <div className="col-lg-12">
                <div className="row">
                    <div className="col-lg-6" style={{ paddingLeft: "0px" }}>
                        <p className="title-info">Verify Member Information</p>
                        <p className="subtitle-info"><i
                            className="fas fa-exclamation-triangle"></i> Verify
                            the member information using the toggles bellow</p>
                    </div>

                    <div className="col-lg-2 checkbox">
                        <div className="row display-checkbox">
                            <p className="text-checkbox"
                               style={{ marginRight: "10px" }}>Verify All</p>
                            <Switch />
                        </div>
                    </div>

                    <div className="col-lg-10 checkbox inline">
                        <div className="row row-no-margin">
                            <div className="col-lg-4 step1">
                                <p className="text-checkbox title-row">Address</p>
                            </div>

                            <div className="col-lg-5">
                                <p className="text-checkbox">10024 Main St
                                    Bothell, WA 98011</p>
                            </div>

                            <div className="col-lg-2 switch">
                                <Switch />
                            </div>

                            <div className="col-lg-1 btn-edit">
                                <Modal title="Edit Member Address"
                                       nameField="Address" />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-10 checkbox inline">
                        <div className="row row-no-margin">
                            <div className="col-lg-4 step1">
                                <p className="text-checkbox title-row">Phone</p>
                            </div>

                            <div className="col-lg-5">
                                <p className="text-checkbox">(323) 444-5555</p>
                            </div>

                            <div className="col-lg-2 switch">
                                <Switch />
                            </div>

                            <div className="col-lg-1 btn-edit">
                                <Modal title="Edit Member Phone"
                                       nameField="Phone" />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-10 checkbox inline">
                        <div className="row row-no-margin">
                            <div className="col-lg-4 step1">
                                <p className="text-checkbox title-row">Plan</p>
                            </div>

                            <div className="col-lg-5">
                                <p className="text-checkbox">Molina Healthcare
                                    Washington</p>
                            </div>

                            <div className="col-lg-2 switch">
                                <Switch />
                            </div>

                            <div className="col-lg-1 btn-edit">
                                <Modal title="Edit Member Plan"
                                       nameField="Plan" />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-10 checkbox inline">
                        <div className="row row-no-margin">
                            <div className="col-lg-4 step1">
                                <p className="text-checkbox title-row">Line of
                                    Business</p>
                            </div>

                            <div className="col-lg-5">
                                <p className="text-checkbox">Medicaid (Apple
                                    Health/IMC)</p>
                            </div>

                            <div className="col-lg-2 switch">
                                <Switch />
                            </div>

                            <div className="col-lg-1 btn-edit">
                                <Modal title="Edit Line of Business"
                                       nameField="Business" />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-10 checkbox inline">
                        <div className="row row-no-margin">
                            <div className="col-lg-4 step1">
                                <p className="text-checkbox title-row">Member
                                    ID</p>
                            </div>

                            <div className="col-lg-5">
                                <p className="text-checkbox">TEST12321SAD123</p>
                            </div>

                            <div className="col-lg-2 switch">
                                <Switch />
                            </div>

                            <div className="col-lg-1 btn-edit">
                                <Modal title="Edit Member ID" nameField="id" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
);

export default NewRequestAddSteps1;

import React from "react";

import Switch from "../../components/inputs/Switch";
import Modal from "../../components/modal/Modal";

import "./newRequestAddSteps.css";

const NewRequestAddSteps1 = () => (
    <>
        <div className="container-info">
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-6 pl-0">
                        <p className="title-info">Verify Member Information</p>
                        <p className="subtitle-info">
                            <i className="fas fa-exclamation-triangle" /> Verify
                            the member information using the toggles bellow
                        </p>
                    </div>

                    <div className="col-md-10 checkbox inline row ml-0">
                        <div className="col-md-4">
                            <p className="text-checkbox title-row">Address</p>
                        </div>

                        <div className="col-md-5">
                            <p className="text-checkbox">
                                10024 Main St Bothell, WA 98011
                            </p>
                        </div>

                        <div className="col-md-2 my-auto">
                            <Switch />
                        </div>

                        <div className="col-md-1 my-auto">
                            <Modal
                                title="Edit Member Address"
                                nameField="Address"
                            />
                        </div>
                    </div>

                    <div className="col-md-10 checkbox inline row ml-0">
                        <div className="col-md-4">
                            <p className="text-checkbox title-row">Phone</p>
                        </div>

                        <div className="col-md-5">
                            <p className="text-checkbox">(323) 444-5555</p>
                        </div>

                        <div className="col-md-2 my-auto">
                            <Switch />
                        </div>

                        <div className="col-md-1 my-auto">
                            <Modal
                                title="Edit Member Phone"
                                nameField="Phone"
                            />
                        </div>
                    </div>

                    <div className="col-md-10 checkbox inline row ml-0">
                        <div className="col-md-4">
                            <p className="text-checkbox title-row">Plan</p>
                        </div>

                        <div className="col-md-5">
                            <p className="text-checkbox">
                                Molina Healthcare Washington
                            </p>
                        </div>

                        <div className="col-md-2 my-auto">
                            <Switch />
                        </div>

                        <div className="col-md-1 my-auto">
                            <Modal title="Edit Member Plan" nameField="Plan" />
                        </div>
                    </div>

                    <div className="col-md-10 checkbox inline row ml-0">
                        <div className="col-md-4">
                            <p className="text-checkbox title-row">
                                Line of Business
                            </p>
                        </div>

                        <div className="col-md-5">
                            <p className="text-checkbox">
                                Medicaid (Apple Health/IMC)
                            </p>
                        </div>

                        <div className="col-md-2 my-auto">
                            <Switch />
                        </div>

                        <div className="col-md-1 my-auto">
                            <Modal
                                title="Edit Line of Business"
                                nameField="Business"
                            />
                        </div>
                    </div>

                    <div className="col-md-10 checkbox inline row ml-0">
                        <div className="col-md-4">
                            <p className="text-checkbox title-row">Member ID</p>
                        </div>

                        <div className="col-md-5">
                            <p className="text-checkbox">TEST12321SAD123</p>
                        </div>

                        <div className="col-md-2 my-auto">
                            <Switch />
                        </div>

                        <div className="col-md-1 my-auto">
                            <Modal title="Edit Member ID" nameField="id" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
);

export default NewRequestAddSteps1;

import React, { useState } from "react";

import Modal from "../elements/Modal";
import InputText from "../inputs/InputText";
import Select from "../inputs/Select";
import Button from "../inputs/Button";

import "./Modal.css";

const FormModal = ({ title, nameField }) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const content = (nameField) => {
        switch (nameField) {
            case "Address":
                return (
                    <div className="row row-no-margin">
                        <div className="col-md-6">
                            <InputText name="address_1" label="Address 1" />
                        </div>

                        <div className="col-md-6">
                            <InputText name="address_2" label="Address 2" />
                        </div>

                        <div className="col-md-6">
                            <InputText name="Zip" label="Zip" />
                        </div>

                        <div className="col-md-6">
                            <InputText name="City" label="City" />
                        </div>

                        <div className="col-md-6">
                            <InputText name="State" label="State" />
                        </div>

                        <div className="col-md-6">
                            <Select
                                name="country"
                                label="Country"
                                options={[
                                    {
                                        id: "eua",
                                        title: "EUA",
                                        val: "EUA",
                                    },
                                ]}
                            />
                        </div>
                    </div>
                );

            case "Phone":
                return (
                    <div className="row row-no-margin">
                        <div className="col-md-12 no-padding-right">
                            <InputText name="phone" label="Phone" />
                        </div>
                    </div>
                );

            case "Plan":
                return (
                    <div className="row row-no-margin">
                        <div className="col-md-12 no-padding-right">
                            <Select
                                name="member_plan"
                                label="Member Plan"
                                options={[
                                    {
                                        id: "Molina Healthcare Washington",
                                        title: "Molina Healthcare Washington",
                                        val: "Molina Healthcare Washington",
                                    },
                                ]}
                            />
                        </div>
                    </div>
                );

            case "Business":
                return (
                    <div className="row row-no-margin">
                        <div className="col-md-12 no-padding-right">
                            <Select
                                name="line_of_business"
                                label="Line of business"
                                options={[
                                    {
                                        id: "Medicaid (Apple Health / IMC)",
                                        title: "Medicaid (Apple Health / IMC)",
                                        val: "Medicaid (Apple Health / IMC)",
                                    },
                                ]}
                            />
                        </div>
                    </div>
                );

            case "id":
                return (
                    <div className="row row-no-margin">
                        <div className="col-md-12 no-padding-right">
                            <InputText name="member_id" label="Member ID" />
                        </div>
                    </div>
                );
        }
    };
    return (
        <div>
            <a className="action-btn" onClick={handleClickOpen}>
                <i className="far fa-edit"></i>
            </a>

            <Modal show={open} onHide={onclose} title={title}>
                <div className="col-md-12">{content(nameField)}</div>

                <div className="col-md-12" style={{ marginBottom: "24px" }}>
                    <div className="row row-no-margin">
                        <div className="col-md-6"></div>

                        <div className="col-md-3">
                            <Button
                                className="btn-blue btn-outline"
                                label="Cancel"
                                onClick={handleClose}
                            />
                        </div>

                        <div className="col-md-3">
                            <Button
                                className="btn-blue text-btn"
                                label="Update"
                                onClick={handleClose}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default FormModal;

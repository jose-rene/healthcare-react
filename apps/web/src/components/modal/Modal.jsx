import React, { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router";
import { isEmpty } from "lodash";

import Modal from "../elements/Modal";
import InputText from "../inputs/InputText";
import Select from "../inputs/Select";
import Button from "../inputs/Button";
import useApiCall from "../../hooks/useApiCall";

import "./Modal.css";

const FormModal = ({ title, nameField, data, member_id }) => {
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const [{ data: payerProfile }, payerProfileRequest] = useApiCall({
        url: "payer/profile",
    });

    const [{ data: memberData, loading, error }, fireSubmit] = useApiCall({
        method: "put",
        url: `member/${member_id}`,
    });

    const handleClickOpen = () => {
        setOpen(true);
        setEditData(data);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleUpdate = async (nameField, editData) => {
        let submitData;
        switch (nameField) {
            case "address":
                submitData = editData;
                break;

            case "phone":
                submitData = { phone: editData.number };
                break;

            case "plan":
                submitData = { plan: editData.id };
                break;

            case "line_of_business":
                submitData = { line_of_business: editData.id };
                break;

            case "member_number":
                submitData = {
                    member_number: editData.member_number,
                };
                break;
        }

        if (loading) {
            return false;
        }

        try {
            const result = await fireSubmit({ params: submitData });
            if (result) {
                history.go(0);
            }
        } catch (e) {
            console.log("Member update error:", e);
        }
    };

    const handleCancel = () => {
        handleClose();
    };

    const updateData = ({ target: { name, value } }) => {
        setEditData({ ...editData, [name]: value });
    };

    const planOptions = useMemo(() => {
        if (isEmpty(payerProfile) || !payerProfile.payers.length) {
            return [];
        }

        return payerProfile.payers.map(({ id, company_name }) => {
            return { id, title: company_name, val: id };
        });
    }, [payerProfile]);

    const lobOptions = useMemo(() => {
        if (isEmpty(payerProfile) || !payerProfile.lines_of_business.length) {
            return [];
        }

        return payerProfile.lines_of_business.map(({ id, name }) => {
            return { id, title: name, val: id };
        });
    }, [payerProfile]);

    useEffect(() => {
        if (isEmpty(payerProfile)) {
            payerProfileRequest();
        }
    }, [payerProfile]);

    const content = (nameField) => {
        switch (nameField) {
            case "address":
                return (
                    <div className="row">
                        <div className="col-md-6">
                            <InputText
                                name="address_1"
                                value={editData ? editData.address_1 : ""}
                                label="Address 1"
                                onChange={updateData}
                            />
                        </div>

                        <div className="col-md-6">
                            <InputText
                                name="address_2"
                                value={editData ? editData.address_2 : ""}
                                label="Address 2"
                                onChange={updateData}
                            />
                        </div>

                        <div className="col-md-6">
                            <InputText
                                name="postal_code"
                                value={editData ? editData.postal_code : ""}
                                label="Zip"
                                onChange={updateData}
                            />
                        </div>

                        <div className="col-md-6">
                            <InputText
                                name="city"
                                value={editData ? editData.city : ""}
                                label="City"
                                onChange={updateData}
                            />
                        </div>

                        <div className="col-md-6">
                            <InputText
                                name="state"
                                value={editData ? editData.state : ""}
                                label="State"
                                onChange={updateData}
                            />
                        </div>

                        <div className="col-md-6">
                            <InputText
                                name="county"
                                value={editData ? editData.county : ""}
                                label="County"
                                onChange={updateData}
                            />
                        </div>
                    </div>
                );

            case "phone":
                return (
                    <div className="row">
                        <div className="col-md-12">
                            <InputText
                                name="number"
                                value={editData ? editData.number : ""}
                                label="Phone"
                                onChange={updateData}
                            />
                        </div>
                    </div>
                );

            case "plan":
                return (
                    <div className="row">
                        <div className="col-md-12">
                            <Select
                                name="id"
                                label="Member Plan"
                                value={editData ? editData.id : null}
                                options={planOptions}
                                onChange={updateData}
                            />
                        </div>
                    </div>
                );

            case "line_of_business":
                return (
                    <div className="row">
                        <div className="col-md-12">
                            <Select
                                name="id"
                                label="Line of business"
                                value={editData ? editData.id : null}
                                options={lobOptions}
                                onChange={updateData}
                            />
                        </div>
                    </div>
                );

            case "member_number":
                return (
                    <div className="row">
                        <div className="col-md-12">
                            <InputText
                                name="member_number"
                                value={editData ? editData.member_number : ""}
                                label="Member ID"
                                onChange={updateData}
                            />
                        </div>
                    </div>
                );
        }
    };
    return (
        <div>
            <a className="action-btn" onClick={handleClickOpen}>
                <i className="far fa-edit" />
            </a>

            <Modal show={open} onHide={onclose} title={title}>
                <div className="col-md-12">{content(nameField)}</div>

                <div className="col-md-12" style={{ marginBottom: "24px" }}>
                    <div className="row">
                        <div className="col-md-6"></div>

                        <div className="col-md-3">
                            <Button
                                outline
                                label="Cancel"
                                onClick={handleCancel}
                            />
                        </div>

                        <div className="col-md-3">
                            <Button
                                className="btn-blue text-btn"
                                label="Update"
                                onClick={() => {
                                    handleUpdate(nameField, editData);
                                    handleClose();
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default FormModal;

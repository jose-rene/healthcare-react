import React from "react";

import Button from "../inputs/Button";

import Modal from "./Modal";

const ConfirmationModal = ({
    showModal,
    content,
    handleAction,
    handleCancel,
    loading,
}) => (
    <Modal show={showModal} onHide={handleCancel}>
        <div className="col-md-12 px-4 pt-4">
            <div className="row mb-4">
                <div className="col-md-12">{content}</div>
            </div>
            <div className="row">
                <div className="col-md-6" />

                <div className="col-md-3 mb-2">
                    <Button
                        className="btn-block d-flex justify-content-center"
                        outline
                        label="Cancel"
                        onClick={handleCancel}
                    />
                </div>

                <div className="col-md-3">
                    <Button
                        loading={loading}
                        className="btn-blue text-btn btn-block d-flex justify-content-center"
                        label="Confirm"
                        onClick={handleAction}
                    />
                </div>
            </div>
        </div>
    </Modal>
);

export default ConfirmationModal;

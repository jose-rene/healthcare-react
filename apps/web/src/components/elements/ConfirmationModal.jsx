import React from "react";

import Button from "../inputs/Button";

import Modal from "./Modal";

const ConfirmationModal = ({
    showModal,
    content,
    handleAction,
    handleCancel,
}) => {
    return (
        <Modal show={showModal} onHide={handleAction}>
            <div className="col-md-12 px-4 pt-4">
                <div className="row mb-4">
                    <div className="col-md-12">{content}</div>
                </div>
                <div className="row">
                    <div className="col-md-6" />

                    <div className="col-md-3 mb-2">
                        <Button
                            className="btn-block"
                            outline
                            label="Cancel"
                            onClick={() => handleCancel()}
                        />
                    </div>

                    <div className="col-md-3">
                        <Button
                            className="btn-blue text-btn btn-block"
                            label="Confirm"
                            onClick={() => handleAction()}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;

import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";

import { Button } from "components";
import FapIcon from "components/elements/FapIcon";
import ConfirmationModal from "components/elements/ConfirmationModal";
import PageAlert from "components/elements/PageAlert";
import TableAPI from "components/elements/TableAPI";
import AddressForm from "components/elements/AddressForm";
import Form from "components/elements/Form";
import Modal from "components/elements/Modal";

import useApiCall from "hooks/useApiCall";
import useToast from "hooks/useToast";

import { ACTIONS } from "helpers/table";

const AddressTab = ({
    company_id,
    payerId,
    address_list,
    addressTypesOptions,
}) => {
    const { generalError } = useToast();

    const [addressHeaders] = useState([
        {
            columnMap: "type",
            label: "Type",
            type: String,
            disableSortBy: true,
            formatter({ name }) {
                return <span>{name}</span>;
            },
        },
        {
            columnMap: "address_1",
            label: "Address",
            type: String,
            disableSortBy: true,
            formatter(address_1, { address_2 }) {
                return (
                    <span>
                        {address_1} {address_2}
                    </span>
                );
            },
        },
        {
            columnMap: "city",
            label: "City",
            type: String,
            disableSortBy: true,
        },
        {
            columnMap: "state",
            label: "State",
            type: String,
            disableSortBy: true,
        },
        {
            columnMap: "postal_code",
            label: "Zip",
            type: String,
            disableSortBy: true,
        },
        {
            columnMap: "id",
            label: "Actions",
            type: ACTIONS,
            disableSortBy: true,
            formatter(id, address) {
                return (
                    <div className="actions">
                        <FapIcon
                            size="1x"
                            icon="edit"
                            className="mx-1"
                            onClick={() => setEditAddress(address)}
                        />
                        <FapIcon
                            size="1x"
                            icon="trash-alt"
                            className="mx-1"
                            onClick={() => handleDeleteAddress(id)}
                        />
                    </div>
                );
            },
        },
    ]);

    const [addressDeleteStatus, setAddressDeleteStatus] = useState(false);
    const [addressAddStatus, setAddressAddStatus] = useState(false);
    const [deleteAddress, setDeleteAddress] = useState(null);
    const [editAddress, setEditAddress] = useState(null);
    const [addressUpdateStatus, setAddressUpdateStatus] = useState(false);
    const [
        showDeleteAddressConfirmationModal,
        setShowDeleteAddressConfirmationModal,
    ] = useState(false);

    const [{ error: addressInfoError }, addressInfoUpdateRequest] = useApiCall({
        method: "put",
        url: `/admin/payer/${payerId}/address/${editAddress?.id}`,
    });

    const [{ error: addressesError }, requestAddressesData] = useApiCall({
        method: "post",
        url: `/admin/payer/${company_id}/address`,
    });

    const [{ error: addressDeleteInfoError }, addressInfoDeleteRequest] =
        useApiCall({
            method: "delete",
        });

    const handleClose = () => {
        setEditAddress(false);
    };

    const handleDeleteAddressConfirm = async () => {
        setShowDeleteAddressConfirmationModal(false);

        try {
            const result = await addressInfoDeleteRequest({
                url: `/admin/payer/${payerId}/address/${deleteAddress?.id}`,
            });

            if (result) {
                setAddressDeleteStatus(true);
            }
        } catch (e) {
            console.log("Contact Info Delete Error:", e);
        }
    };

    const handleDeleteAddressCancel = () => {
        setShowDeleteAddressConfirmationModal(false);
    };

    const handleDeleteAddress = (id) => {
        setShowDeleteAddressConfirmationModal(true);
        setDeleteAddress({ id });
    };

    /* eslint-disable */
    const handleUpdateAddress = async (formData) => {
        try {
            const result = await addressInfoUpdateRequest({
                params: formData,
            });

            if (result) {
                setAddressUpdateStatus(true);

                handleClose();
            }
        } catch (e) {
            console.log("Address Info Update Error:", e);
            generalError();
        }
    };
    /* eslint-enable */

    const handleAddressSave = async (params) => {
        try {
            const result = await requestAddressesData({ params });

            if (result) {
                setAddressAddStatus(true);
                handleClose();
            }
        } catch (e) {
            console.log("Add Address Error:", e);
            generalError();
        }
    };

    return (
        <>
            <PageAlert
                show={addressesError}
                className="mt-3 w-100"
                variant="warning"
                timeout={5000}
                dismissible
            >
                Error: {addressesError}
            </PageAlert>

            <PageAlert
                show={addressAddStatus}
                className="mt-3 w-100"
                variant="success"
                timeout={5000}
                dismissible
            >
                Address successfully added.
            </PageAlert>

            <ConfirmationModal
                showModal={showDeleteAddressConfirmationModal}
                content="Are you sure that you will delete this address?"
                handleAction={handleDeleteAddressConfirm}
                handleCancel={handleDeleteAddressCancel}
            />

            <Modal show={!!editAddress}>
                <Form
                    className="form-row p-3"
                    defaultData={{ address: editAddress }}
                    onSubmit={handleUpdateAddress}
                >
                    <AddressForm />

                    <Row>
                        <Col md={12}>
                            <Row>
                                <Col md={6}></Col>

                                <Col md={3} className="mt-3">
                                    <Button
                                        variant="primary"
                                        block
                                        label="Update"
                                        type="submit"
                                    />
                                </Col>

                                <Col md={3} className="mt-3">
                                    <Button
                                        outline
                                        block
                                        label="Cancel"
                                        onClick={handleClose}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            <Row className="bg-white py-4 mx-0">
                <Col md={6}>
                    {addressDeleteInfoError ? (
                        <PageAlert
                            className="mt-3 w-100"
                            variant="warning"
                            timeout={5000}
                            dismissible
                        >
                            Error: {addressDeleteInfoError}
                        </PageAlert>
                    ) : null}

                    <PageAlert
                        show={addressDeleteStatus}
                        className="mt-3 w-100"
                        variant="success"
                        timeout={5000}
                        dismissible
                    >
                        Address Info successfully deleted.
                    </PageAlert>

                    <PageAlert
                        show={!!addressInfoError}
                        className="mt-3 w-100"
                        variant="warning"
                        timeout={5000}
                        dismissible
                    >
                        Error: {addressInfoError}
                    </PageAlert>

                    <PageAlert
                        show={addressUpdateStatus}
                        className="mt-3 w-100"
                        variant="success"
                        timeout={5000}
                        dismissible
                    >
                        Address Info successfully updated.
                    </PageAlert>

                    <TableAPI
                        searchObj={{}}
                        headers={addressHeaders}
                        loading={false}
                        data={address_list}
                        dataMeta={{}}
                    />
                </Col>

                <Col md={6}>
                    <Form onSubmit={handleAddressSave}>
                        <AddressForm
                            addressTypesOptions={addressTypesOptions}
                        />

                        <Button typ="submit" label="Add" block />
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default AddressTab;

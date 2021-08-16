import React, { useState } from "react";
import useApiCall from "../../../../hooks/useApiCall";
import ConfirmationModal from "../../../../components/elements/ConfirmationModal";
import Modal from "../../../../components/elements/Modal";
import InputText from "../../../../components/inputs/ContextInput";
import Checkbox from "../../../../components/inputs/Checkbox";
import { Button } from "../../../../components";
import PageAlert from "../../../../components/elements/PageAlert";
import TableAPI from "../../../../components/elements/TableAPI";
import useToast from "../../../../hooks/useToast";
import { ACTIONS } from "../../../../helpers/table";
import Icon from "../../../../components/elements/Icon";
import ContactMethods from "../../../../components/elements/ContactMethods";
import Form from "../../../../components/elements/Form";

const ContactTab = ({
    company_id,
    payerId,
    contacts,
}) => {
    const { generalError } = useToast();

    const [contactMethods, setContactMethods] = useState([
        { type: "type", phone_email: "phone_email" },
    ]);

    const [contactDeleteStatus, setContactDeleteStatus] = useState(false);
    const [contactAddStatus, setContactAddStatus] = useState(false);
    const [editContact, setEditContact] = useState(null);
    const [contactUpdateStatus, setContactUpdateStatus] = useState(false);
    const [deleteContact, setDeleteContact] = useState(null);
    const [showDeleteContactConfirmationModal, setShowDeleteContactConfirmationModal] = useState(false);

    const [contactHeaders] = useState([
        {
            columnMap: "description",
            label: "Description",
            type: String,
            disableSortBy: true,
        },
        {
            columnMap: "contact",
            label: "Contact",
            type: String,
            disableSortBy: true,
        },
        {
            columnMap: "id",
            label: "Actions",
            type: ACTIONS,
            disableSortBy: true,
            formatter (id, contact) {
                return (
                    <div className="actions">
                        <Icon
                            size="1x"
                            icon="edit"
                            className="action bg-primary text-white"
                            onClick={() =>
                                setEditContact({ ...contact })
                            }
                        />
                        <Icon
                            size="1x"
                            icon="trash-alt"
                            className="action bg-danger text-white"
                            onClick={() => handleDeleteContact(id, contact.type)}
                        />
                    </div>
                );
            },
        },
    ]);

    const [
        { error: contactDeleteInfoError },
        contactInfoDeleteRequest,
    ] = useApiCall({
        method: "delete",
    });

    const [{ error: contactInfoError }, contactInfoUpdateRequest] = useApiCall({
        method: "put",
        url: `/admin/payer/${payerId}/${editContact?.type}/${editContact?.id}`,
    });

    const [
        { error: contactMethodsError },
        requestContactMethodsData,
    ] = useApiCall({
        method: "post",
        url: `/admin/payer/${company_id}/contact`,
    });

    const handleClose = () => {
        setEditContact(false);
    };

    const handleUpdateContact = async () => {
        try {
            const { type } = editContact || {};

            const contactParam = type === "email" ? "email" : "number";

            const result = await contactInfoUpdateRequest({
                params: {
                    is_primary: editContact?.is_primary,
                    [contactParam]: editContact?.contact,
                },
            });

            if (result) {
                setContactUpdateStatus(true);
                handleClose();
            }
        } catch (e) {
            console.log("Contact Info Update Error:", e);
            generalError();
        }
    };

    const handleDeleteContact = (id, type) => {
        setShowDeleteContactConfirmationModal(true);
        setDeleteContact({
            id,
            type,
        });
    };

    const handleDeleteContactConfirm = async () => {
        handleContactClose();

        try {
            const result = await contactInfoDeleteRequest({
                url: `/admin/payer/${payerId}/${deleteContact?.type}/${deleteContact?.id}`,
            });

            if (result) {
                setContactDeleteStatus(true);
            }
        } catch (e) {
            console.log("Contact Info Delete Error:", e);
            generalError();
        }
    };

    const handleContactClose = () => {
        setShowDeleteContactConfirmationModal(false);
    };

    const handleSubmit = async (formData) => {
        console.log("contactTab.handleSubmit", { formData });
        const { contactMethods = [] } = formData;

        const sendData = [];
        contactMethods.forEach((v) => {
            sendData.push({
                type: contacts[v.type],
                value: contacts[v.phone_email],
            });
        });

        try {
            const result = await requestContactMethodsData({
                params: { contacts: sendData },
            });

            if (result) {
                setContactAddStatus(true);
            }
        } catch (e) {
            console.log("Add Contact Methods Error:", e);
            generalError();
        }
    };

    return (
        <>
            <PageAlert
                show={!!contactMethodsError}
                className="mt-3 w-100"
                variant="warning"
                timeout={5000}
                dismissible
            >
                Error: {contactMethodsError}
            </PageAlert>

            <PageAlert
                show={contactAddStatus}
                className="mt-3 w-100"
                variant="success"
                timeout={5000}
                dismissible
            >
                Contact successfully added.
            </PageAlert>

            <ContactMethods
                contactMethods={contactMethods}
                setContactMethods={setContactMethods}
                data-todo="fix setContactMethodsValue"
            />

            <ConfirmationModal
                showModal={showDeleteContactConfirmationModal}
                content="Are you sure that you will delete this contact?"
                handleAction={handleDeleteContactConfirm}
                handleCancel={handleContactClose}
            />

            <Modal
                show={!!editContact}
                onHide={handleClose}
            >
                <Form onSubmit={handleSubmit} defaultData={editContact}>
                    <div className="col-md-12">
                        <InputText
                            label={editContact?.description}
                            name="contact"
                        />
                    </div>

                    <div className="col-md-12">
                        <div className="form-control custom-checkbox">
                            <Checkbox
                                labelLeft
                                label="Primary"
                                name="is_primary"
                            />
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-6" />

                            <div className="col-md-3 mt-3">
                                <Button
                                    className="btn btn-block"
                                    label="Update"
                                    onClick={handleUpdateContact}
                                />
                            </div>

                            <div className="col-md-3 mt-3">
                                <Button
                                    outline
                                    className="btn btn-block"
                                    label="Cancel"
                                    onClick={handleClose}
                                />
                            </div>
                        </div>
                    </div>
                </Form>
            </Modal>

            <div className="white-box mt-0">
                <PageAlert
                    show={!!contactInfoError}
                    className="mt-3 w-100"
                    variant="warning"
                    timeout={5000}
                    dismissible
                >
                    Error: {contactInfoError}
                </PageAlert>

                <PageAlert
                    show={contactUpdateStatus}
                    className="mt-3 w-100"
                    variant="success"
                    timeout={5000}
                    dismissible
                >
                    Contact Info successfully updated.
                </PageAlert>

                <PageAlert
                    show={contactDeleteInfoError}
                    className="mt-3 w-100"
                    variant="warning"
                    timeout={5000}
                    dismissible
                >
                    Error: {contactDeleteInfoError}
                </PageAlert>

                <PageAlert
                    show={contactDeleteStatus}
                    className="mt-3 w-100"
                    variant="success"
                    timeout={5000}
                    dismissible
                >
                    Contact Info successfully deleted.
                </PageAlert>

                <TableAPI
                    searchObj={{}}
                    headers={contactHeaders}
                    loading={false}
                    data={contacts}
                    dataMeta={{}}
                />
            </div>
        </>
    );
};

export default ContactTab;

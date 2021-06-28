import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Form, Tabs, Tab } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { isEmpty } from "lodash";
import MultiSelect from "react-select";

import TableAPI from "../../../../components/elements/TableAPI";
import ContactMethods from "../../../../components/elements/ContactMethods";
import PageAlert from "../../../../components/elements/PageAlert";
import Modal from "../../../../components/elements/Modal";
import ConfirmationModal from "../../../../components/elements/ConfirmationModal";

import InputText from "../../../../components/inputs/InputText";
import Checkbox from "../../../../components/inputs/Checkbox";
import Select from "../../../../components/inputs/Select";
import Icon from "../../../../components/elements/Icon";
import Button from "../../../../components/inputs/Button";

import { ACTIONS } from "../../../../helpers/table";

import useApiCall from "../../../../hooks/useApiCall";

const adressTestData = [
    {
        id: "addressTestData",
        type: "Mailing",
        address: "211 Hope St",
        city: "Mountain View",
        state: "CA",
        zip: "94-41",
    },
];

const TabCompanyInfo = ({ data, udpateSuccess, setUpdateSuccess }) => {
    const history = useHistory();
    const company_id = history.location.pathname.split("/")[3];
    const {
        id: payerId,
        company_name,
        category,
        abbreviation,
        assessment_label,
        member_number_types,
        has_phi,
    } = data;

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
            formatter(id, { is_primary, contact, type, description }) {
                return (
                    <>
                        <Icon
                            size="1x"
                            icon="edit"
                            className="mr-2 bg-primary text-white rounded-circle p-1"
                            onClick={() =>
                                handleEdit(
                                    id,
                                    is_primary,
                                    contact,
                                    type,
                                    description
                                )
                            }
                        />
                        <Icon
                            size="1x"
                            icon="trash-alt"
                            className="bg-danger text-white rounded-circle p-1"
                            onClick={() => handleDelete(id, type)}
                        />
                    </>
                );
            },
        },
    ]);

    const [addressHeaders] = useState([
        {
            columnMap: "type",
            label: "Type",
            type: String,
            disableSortBy: true,
        },
        {
            columnMap: "address",
            label: "Address",
            type: String,
            disableSortBy: true,
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
            columnMap: "zip",
            label: "Zip",
            type: String,
            disableSortBy: true,
        },
        {
            columnMap: "id",
            label: "Actions",
            type: ACTIONS,
            disableSortBy: true,
            formatter(id) {
                return (
                    <>
                        <Icon
                            size="1x"
                            icon="edit"
                            className="mr-2 bg-primary text-white rounded-circle p-1"
                        />
                        <Icon
                            size="1x"
                            icon="trash-alt"
                            className="bg-danger text-white rounded-circle p-1"
                        />
                    </>
                );
            },
        },
    ]);

    const { handleSubmit, register, errors } = useForm();

    const [
        { loading: categoryLoading, data: categoryData },
        requestCategoryData,
    ] = useApiCall({
        url: "/admin/company/categories",
    });

    const [
        {
            loading: contactMethodsLoading,
            data: contactMethodsData,
            error: contactMethodsError,
        },
        requestContactMethodsData,
    ] = useApiCall({
        method: "post",
        url: `/admin/payer/${company_id}/contact`,
    });

    const [payerCategoryOptions, setPayerCategoryOptions] = useState([]);
    const [memberIdTypesOptions, setMemberIdTypesOptions] = useState([]);
    const [memberIdTypesValue, setMemberIdTypesValue] = useState([]);
    const [contactMethods, setContactMethods] = useState([
        { type: "type", phone_email: "phone_email" },
    ]);
    const [contacts, setContacts] = useState({});
    const [companyInfoStatus, setCompanyInfoStatus] = useState(false);
    const [phiStatus, setPhiStatus] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editContact, setEditContact] = useState(null);
    const [contactUpdateStatus, setContactUpdateStatus] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [deleteContact, setDeleteContact] = useState(null);
    const [contactDeleteStatus, setContactDeleteStatus] = useState(false);

    useEffect(() => {
        requestCategoryData();
    }, []);

    useEffect(() => {
        setPhiStatus(has_phi);
    }, [has_phi]);

    useEffect(() => {
        setUpdateSuccess(false);
        setContactUpdateStatus(false);
        setContactDeleteStatus(false);
    }, [data]);

    useEffect(() => {
        if (isEmpty(categoryData)) {
            return;
        }

        const { payer_categories, member_number_types: types } = categoryData;

        const payerArr = [{ id: "", title: "", val: "" }];
        payer_categories.forEach(({ id, name }) => {
            payerArr.push({
                id,
                title: name,
                val: id,
                selected: Number(category?.id) === id ? "selected" : false,
            });
        });

        const typesArr = [];
        types.forEach(({ id, name }) => {
            typesArr.push({ value: id, label: name });
        });

        setPayerCategoryOptions(payerArr);
        setMemberIdTypesOptions(typesArr);
    }, [categoryData, category]);

    useEffect(() => {
        if (!member_number_types) {
            return;
        }

        const typesArr = [];
        member_number_types.forEach(({ id, title }) => {
            typesArr.push({ value: id, label: title });
        });

        setMemberIdTypesValue(typesArr);
    }, [member_number_types]);

    const handleAddContactMethods = async () => {
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
                setUpdateSuccess(true);
            }
        } catch (e) {
            console.log("Add Contact Methods Error:", e);
        }
    };

    const setContactMethodsValue = ({ target: { name, value } }) => {
        setContacts({ ...contacts, [name]: value });
    };

    const [
        {
            data: companyInfo,
            loading: companyInfoLoading,
            error: companyInfoError,
        },
        companyInfoUpdateRequest,
    ] = useApiCall({
        method: "put",
        url: `/admin/payer/${company_id}`,
    });

    const handleUpdate = async (formUpdateData) => {
        const memberNumberTypes = memberIdTypesValue.map((item) => {
            return item.value;
        });

        try {
            const result = await companyInfoUpdateRequest({
                params: {
                    ...formUpdateData,
                    member_number_types: memberNumberTypes,
                },
            });

            setCompanyInfoStatus(true);
        } catch (e) {
            setCompanyInfoStatus(false);
            console.log("Company Info Update Error:", e);
        }
    };

    const handleMemberIdTypes = (value) => {
        setMemberIdTypesValue(value);
    };

    const handlePhiStatus = () => {
        setPhiStatus(!phiStatus);
    };

    const handleEdit = (id, is_primary, contact, type, description) => {
        setEditContact({
            id,
            is_primary,
            contact,
            type,
            description,
        });

        setShowModal(!showModal);
    };

    const handleUpdateEditData = ({ target: { name, value } }) => {
        setEditContact({ ...editContact, [name]: value });
    };

    const handleClose = () => {
        setShowModal(false);
    };

    const [
        {
            data: contactInfo,
            loading: contactInfoLoading,
            error: contactInfoError,
        },
        contactInfoUpdateRequest,
    ] = useApiCall({
        method: "put",
        url: `/admin/payer/${payerId}/${editContact?.type}/${editContact?.id}`,
    });

    const handleUpdateContact = async () => {
        try {
            const contactParam =
                editContact?.type && editContact.type === "email"
                    ? "email"
                    : "number";
            const result = await contactInfoUpdateRequest({
                params: {
                    is_primary: editContact?.is_primary,
                    [contactParam]: editContact?.contact,
                },
            });

            if (result) {
                setContactUpdateStatus(true);
                setUpdateSuccess(true);
            }
        } catch (e) {
            console.log("Contact Info Update Error:", e);
        }
    };

    const handleDelete = (id, type) => {
        setShowConfirmationModal(true);
        setDeleteContact({
            id,
            type,
        });
    };

    const [
        {
            data: contactDeleteInfo,
            loading: contactDeleteInfoLoading,
            error: contactDeleteInfoError,
        },
        contactInfoDeleteRequest,
    ] = useApiCall({
        method: "delete",
        url: `/admin/payer/${payerId}/${deleteContact?.type}/${deleteContact?.id}`,
    });

    const handleDeleteContactConfirm = async () => {
        setShowConfirmationModal(false);

        try {
            const result = await contactInfoDeleteRequest();

            if (result) {
                setContactDeleteStatus(true);
                setUpdateSuccess(true);
            }
        } catch (e) {
            console.log("Contact Info Delete Error:", e);
        }
    };

    const handleDeleteContactCancel = () => {
        setShowConfirmationModal(false);
    };

    return (
        <>
            <div className="white-box white-box-small">
                {companyInfoError ? (
                    <PageAlert
                        className="mt-3 w-100"
                        variant="warning"
                        timeout={5000}
                        dismissible
                    >
                        Error: {companyInfoError}
                    </PageAlert>
                ) : null}
                {companyInfoStatus ? (
                    <PageAlert
                        className="mt-3 w-100"
                        variant="success"
                        timeout={5000}
                        dismissible
                    >
                        Company Info successfully updated.
                    </PageAlert>
                ) : null}

                <Form onSubmit={handleSubmit(handleUpdate)}>
                    <div className="row">
                        <div className="col-md-3">
                            <InputText
                                name="name"
                                label="Name"
                                placeholder="Name"
                                errors={errors}
                                defaultValue={company_name}
                                ref={register({
                                    required: "Name is required",
                                })}
                            />
                        </div>
                        <div className="col-md-3">
                            <InputText
                                name="abbreviation"
                                label="Abbreviation"
                                placeholder="Abbreviation"
                                defaultValue={abbreviation}
                                errors={errors}
                                ref={register({
                                    required: "Abbreviation is required",
                                })}
                            />
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="form-label">
                                    Member ID Types
                                </label>
                                <MultiSelect
                                    closeMenuOnSelect={false}
                                    value={memberIdTypesValue}
                                    isMulti
                                    placeholder="MediCaid"
                                    options={memberIdTypesOptions}
                                    onChange={handleMemberIdTypes}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <Select
                                name="category_id"
                                label="Payer Category"
                                options={payerCategoryOptions}
                                errors={errors}
                                ref={register({
                                    required: "Payer Category is required",
                                })}
                            />
                        </div>
                        <div className="col-md-3">
                            <InputText
                                name="assessment_label"
                                label="Assessment Label"
                                placeholder="Assessment Label"
                                defaultValue={assessment_label}
                                errors={errors}
                                ref={register({
                                    required: "Assessment Label is required",
                                })}
                            />
                        </div>
                        <div className="col-md-3">
                            <div className="form-control custom-checkbox">
                                <Checkbox
                                    labelLeft
                                    name="has_phi"
                                    label="Includes PHI"
                                    checked={phiStatus}
                                    errors={errors}
                                    ref={register({})}
                                    onChange={() => handlePhiStatus()}
                                />
                            </div>
                        </div>
                        <div className="col-md-3 update-button-top">
                            <Button
                                type="submit"
                                className="btn btn-block btn-primary mb-md-3 py-2"
                            >
                                Update
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>

            <div className="row m-0">
                <div className="col-md-6 pl-0">
                    <Tabs
                        defaultActiveKey="contact-methods"
                        className="inside-tabs"
                    >
                        <Tab eventKey="contact-methods" title="Contact Methods">
                            <ConfirmationModal
                                showModal={showConfirmationModal}
                                content="Are you sure that you will delete this contact?"
                                handleAction={handleDeleteContactConfirm}
                                handleCancel={handleDeleteContactCancel}
                            />

                            <Modal show={showModal} onHide={handleEdit}>
                                <div className="col-md-12">
                                    <InputText
                                        label={editContact?.description}
                                        name="contact"
                                        value={editContact?.contact}
                                        onChange={handleUpdateEditData}
                                    />
                                </div>

                                <div className="col-md-12">
                                    <div className="form-control custom-checkbox">
                                        <Checkbox
                                            labelLeft
                                            label="Primary"
                                            name="is_primary"
                                            checked={editContact?.is_primary}
                                            onChange={handleUpdateEditData}
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
                                                onClick={() => {
                                                    handleUpdateContact();
                                                    handleClose();
                                                }}
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
                            </Modal>
                            <div className="white-box mt-0">
                                {contactInfoError ? (
                                    <PageAlert
                                        className="mt-3 w-100"
                                        variant="warning"
                                        timeout={5000}
                                        dismissible
                                    >
                                        Error: {contactInfoError}
                                    </PageAlert>
                                ) : null}
                                {contactUpdateStatus ? (
                                    <PageAlert
                                        className="mt-3 w-100"
                                        variant="success"
                                        timeout={5000}
                                        dismissible
                                    >
                                        Contact Info successfully updated.
                                    </PageAlert>
                                ) : null}

                                {contactDeleteInfoError ? (
                                    <PageAlert
                                        className="mt-3 w-100"
                                        variant="warning"
                                        timeout={5000}
                                        dismissible
                                    >
                                        Error: {contactDeleteInfoError}
                                    </PageAlert>
                                ) : null}
                                {contactDeleteStatus ? (
                                    <PageAlert
                                        className="mt-3 w-100"
                                        variant="success"
                                        timeout={5000}
                                        dismissible
                                    >
                                        Contact Info successfully deleted.
                                    </PageAlert>
                                ) : null}

                                <TableAPI
                                    searchObj={{}}
                                    headers={contactHeaders}
                                    loading={false}
                                    data={data?.contacts}
                                    dataMeta={{}}
                                />
                            </div>
                        </Tab>

                        <Tab eventKey="addresses" title="Addresses">
                            <div className="white-box mt-0">
                                <TableAPI
                                    searchObj={{}}
                                    headers={addressHeaders}
                                    loading={false}
                                    data={adressTestData}
                                    dataMeta={{}}
                                />
                            </div>
                        </Tab>
                    </Tabs>
                </div>

                <div className="col-md-6 white-box add-contact-method-top w-100 h-100">
                    <div className="form-row">
                        {contactMethodsError ? (
                            <PageAlert
                                className="mt-3 w-100"
                                variant="warning"
                                timeout={5000}
                                dismissible
                            >
                                Error: {contactMethodsError}
                            </PageAlert>
                        ) : null}
                        {udpateSuccess ? (
                            <PageAlert
                                className="mt-3 w-100"
                                variant="success"
                                timeout={5000}
                                dismissible
                            >
                                Contact successfully added.
                            </PageAlert>
                        ) : null}

                        <ContactMethods
                            contactMethods={contactMethods}
                            setContactMethods={setContactMethods}
                            setContactMethodsValue={setContactMethodsValue}
                        />

                        <Button
                            icon="plus"
                            iconSize="sm"
                            label="Add"
                            className="btn btn-block mx-1"
                            onClick={() => {
                                handleAddContactMethods();
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default TabCompanyInfo;

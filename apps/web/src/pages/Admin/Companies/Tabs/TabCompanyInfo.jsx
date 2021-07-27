import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Form, Tabs, Tab } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { isEmpty } from "lodash";
import MultiSelect from "react-select";

import TableAPI from "../../../../components/elements/TableAPI";
import ContactMethods from "../../../../components/elements/ContactMethods";
import AddressForm from "../../../../components/elements/AddressForm";
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

const TabCompanyInfo = ({
    data,
    companyInfoActiveTab,
    setUpdateSuccess,
    setCompanyInfoActiveTab,
}) => {
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
        address_list,
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
                                handleContactEdit(
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
                            onClick={() => handleDeleteContact(id, type)}
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
            formatter(
                id,
                {
                    address_1,
                    address_2,
                    city,
                    county,
                    is_primary,
                    postal_code,
                    state,
                    type,
                }
            ) {
                return (
                    <>
                        <Icon
                            size="1x"
                            icon="edit"
                            className="mr-2 bg-primary text-white rounded-circle p-1"
                            onClick={() =>
                                handleAddressEdit(
                                    id,
                                    address_1,
                                    address_2,
                                    city,
                                    county,
                                    is_primary,
                                    postal_code,
                                    state,
                                    type
                                )
                            }
                        />
                        <Icon
                            size="1x"
                            icon="trash-alt"
                            className="bg-danger text-white rounded-circle p-1"
                            onClick={() => handleDeleteAddress(id)}
                        />
                    </>
                );
            },
        },
    ]);

    const { handleSubmit, register, errors } = useForm();

    const [{ data: categoryData }, requestCategoryData] = useApiCall({
        url: "/admin/company/categories",
    });

    const [payerCategoryOptions, setPayerCategoryOptions] = useState([]);
    const [memberIdTypesOptions, setMemberIdTypesOptions] = useState([]);
    const [addressTypesOptions, setAddressTypesOptions] = useState([]);
    const [memberIdTypesValue, setMemberIdTypesValue] = useState([]);
    const [contactMethods, setContactMethods] = useState([
        { type: "type", phone_email: "phone_email" },
    ]);
    const [contacts, setContacts] = useState({});
    const [companyInfoStatus, setCompanyInfoStatus] = useState(false);
    const [phiStatus, setPhiStatus] = useState(null);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editContact, setEditContact] = useState(null);
    const [editAddress, setEditAddress] = useState(null);
    const [contactUpdateStatus, setContactUpdateStatus] = useState(false);
    const [addressUpdateStatus, setAddressUpdateStatus] = useState(false);
    const [
        showDeleteContactConfirmationModal,
        setShowDeleteContactConfirmationModal,
    ] = useState(false);
    const [
        showDeleteAddressConfirmationModal,
        setShowDeleteAddressConfirmationModal,
    ] = useState(false);
    const [deleteContact, setDeleteContact] = useState(null);
    const [deleteAddress, setDeleteAddress] = useState(null);
    const [addressFormValue, setAddressFormValue] = useState({});
    const [contactDeleteStatus, setContactDeleteStatus] = useState(false);
    const [addressDeleteStatus, setAddressDeleteStatus] = useState(false);
    const [contactAddStatus, setContactAddStatus] = useState(false);
    const [addressAddStatus, setAddressAddStatus] = useState(false);

    useEffect(() => {
        requestCategoryData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setPhiStatus(has_phi);
    }, [has_phi]);

    useEffect(() => {
        setUpdateSuccess(false);
        setContactUpdateStatus(false);
        setContactDeleteStatus(false);
        setContactAddStatus(false);
        setAddressAddStatus(false);
        setAddressUpdateStatus(false);
        setAddressDeleteStatus(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        if (isEmpty(categoryData)) {
            return;
        }

        const {
            payer_categories,
            member_number_types: types,
            address_types,
        } = categoryData;

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

        const addressTypesArr = [{ id: "", title: "", val: "" }];
        address_types.forEach(({ id, name }) => {
            addressTypesArr.push({
                id,
                title: name,
                val: id,
            });
        });

        setPayerCategoryOptions(payerArr);
        setMemberIdTypesOptions(typesArr);
        setAddressTypesOptions(addressTypesArr);
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

    const [
        { error: contactMethodsError },
        requestContactMethodsData,
    ] = useApiCall({
        method: "post",
        url: `/admin/payer/${company_id}/contact`,
    });

    const [{ error: addressesError }, requestAddressesData] = useApiCall({
        method: "post",
        url: `/admin/payer/${company_id}/address`,
    });

    const handleAdd = async () => {
        if (companyInfoActiveTab === "contact-methods") {
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
                    setContactAddStatus(true);
                }
            } catch (e) {
                console.log("Add Contact Methods Error:", e);
            }
        }

        if (companyInfoActiveTab === "addresses") {
            try {
                const result = await requestAddressesData({
                    params: addressFormValue,
                });

                if (result) {
                    setUpdateSuccess(true);
                    setAddressAddStatus(true);
                }
            } catch (e) {
                console.log("Add Address Error:", e);
            }
        }
    };

    const setContactMethodsValue = ({ target: { name, value } }) => {
        setContacts({ ...contacts, [name]: value });
    };

    const [{ error: companyInfoError }, companyInfoUpdateRequest] = useApiCall({
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

            if (result) {
                setCompanyInfoStatus(true);
            }
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

    const handleContactEdit = (id, is_primary, contact, type, description) => {
        setEditContact({
            id,
            is_primary,
            contact,
            type,
            description,
        });

        setShowContactModal(!showContactModal);
    };

    const handleUpdateContactEditData = ({ target: { name, value } }) => {
        if (name === "is_primary") {
            setEditContact({ ...editContact, [name]: !editContact.is_primary });
        } else {
            setEditContact({ ...editContact, [name]: value });
        }
    };

    const handleClose = () => {
        setShowContactModal(false);
        setShowAddressModal(false);
    };

    const [{ error: contactInfoError }, contactInfoUpdateRequest] = useApiCall({
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

    const handleAddressEdit = (
        id,
        address_1,
        address_2,
        city,
        county,
        is_primary,
        postal_code,
        state,
        type
    ) => {
        setEditAddress({
            id,
            address_1,
            address_2,
            city,
            county,
            is_primary,
            postal_code,
            state,
            address_type_id: type?.id,
        });

        setShowAddressModal(!showAddressModal);
    };

    const handleUpdateAddressEditData = ({ target: { name, value } }) => {
        if (name === "is_primary") {
            setEditAddress({ ...editAddress, [name]: !editAddress.is_primary });
        } else {
            setEditAddress({ ...editAddress, [name]: value });
        }
    };

    const [{ error: addressInfoError }, addressInfoUpdateRequest] = useApiCall({
        method: "put",
        url: `/admin/payer/${payerId}/address/${editAddress?.id}`,
    });

    const handleUpdateAddress = async () => {
        try {
            const result = await addressInfoUpdateRequest({
                params: editAddress,
            });

            if (result) {
                setAddressUpdateStatus(true);
                setUpdateSuccess(true);
            }
        } catch (e) {
            console.log("Address Info Update Error:", e);
        }
    };

    const handleDeleteContact = (id, type) => {
        setShowDeleteContactConfirmationModal(true);
        setDeleteContact({
            id,
            type,
        });
    };

    const [
        { error: contactDeleteInfoError },
        contactInfoDeleteRequest,
    ] = useApiCall({
        method: "delete",
        url: `/admin/payer/${payerId}/${deleteContact?.type}/${deleteContact?.id}`,
    });

    const handleDeleteContactConfirm = async () => {
        setShowDeleteContactConfirmationModal(false);

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
        setShowDeleteContactConfirmationModal(false);
    };

    const handleTabs = (currentTab) => {
        setCompanyInfoActiveTab(currentTab);
    };

    const handleDeleteAddress = (id) => {
        setShowDeleteAddressConfirmationModal(true);
        setDeleteAddress({ id });
    };

    const [
        { error: addressDeleteInfoError },
        addressInfoDeleteRequest,
    ] = useApiCall({
        method: "delete",
        url: `/admin/payer/${payerId}/address/${deleteAddress?.id}`,
    });

    const handleDeleteAddressConfirm = async () => {
        setShowDeleteAddressConfirmationModal(false);

        try {
            const result = await addressInfoDeleteRequest();

            if (result) {
                setAddressDeleteStatus(true);
                setUpdateSuccess(true);
            }
        } catch (e) {
            console.log("Contact Info Delete Error:", e);
        }
    };

    const handleDeleteAddressCancel = () => {
        setShowDeleteAddressConfirmationModal(false);
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
                        defaultActiveKey={companyInfoActiveTab}
                        activeKey={companyInfoActiveTab}
                        className="inside-tabs"
                        onSelect={handleTabs}
                    >
                        <Tab eventKey="contact-methods" title="Contact Methods">
                            <ConfirmationModal
                                showModal={showDeleteContactConfirmationModal}
                                content="Are you sure that you will delete this contact?"
                                handleAction={handleDeleteContactConfirm}
                                handleCancel={handleDeleteContactCancel}
                            />

                            <Modal
                                show={showContactModal}
                                onHide={handleContactEdit}
                            >
                                <div className="col-md-12">
                                    <InputText
                                        label={editContact?.description}
                                        name="contact"
                                        value={editContact?.contact}
                                        onChange={handleUpdateContactEditData}
                                    />
                                </div>

                                <div className="col-md-12">
                                    <div className="form-control custom-checkbox">
                                        <Checkbox
                                            labelLeft
                                            label="Primary"
                                            name="is_primary"
                                            checked={editContact?.is_primary}
                                            onChange={
                                                handleUpdateContactEditData
                                            }
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
                            <ConfirmationModal
                                showModal={showDeleteAddressConfirmationModal}
                                content="Are you sure that you will delete this address?"
                                handleAction={handleDeleteAddressConfirm}
                                handleCancel={handleDeleteAddressCancel}
                            />

                            <Modal
                                show={showAddressModal}
                                onHide={handleAddressEdit}
                            >
                                <div className="form-row p-3">
                                    <AddressForm
                                        addressFormValue={editAddress}
                                        addressTypesOptions={
                                            addressTypesOptions
                                        }
                                        setAddressFormValue={setEditAddress}
                                    />

                                    <div className="col-md-12">
                                        <div className="form-control custom-checkbox mt-0">
                                            <Checkbox
                                                labelLeft
                                                label="Primary"
                                                name="is_primary"
                                                checked={
                                                    editAddress?.is_primary
                                                }
                                                onChange={
                                                    handleUpdateAddressEditData
                                                }
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
                                                        handleUpdateAddress();
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
                                </div>
                            </Modal>

                            <div className="white-box mt-0">
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
                                {addressDeleteStatus ? (
                                    <PageAlert
                                        className="mt-3 w-100"
                                        variant="success"
                                        timeout={5000}
                                        dismissible
                                    >
                                        Address Info successfully deleted.
                                    </PageAlert>
                                ) : null}

                                {addressInfoError ? (
                                    <PageAlert
                                        className="mt-3 w-100"
                                        variant="warning"
                                        timeout={5000}
                                        dismissible
                                    >
                                        Error: {addressInfoError}
                                    </PageAlert>
                                ) : null}
                                {addressUpdateStatus ? (
                                    <PageAlert
                                        className="mt-3 w-100"
                                        variant="success"
                                        timeout={5000}
                                        dismissible
                                    >
                                        Address Info successfully updated.
                                    </PageAlert>
                                ) : null}

                                <TableAPI
                                    searchObj={{}}
                                    headers={addressHeaders}
                                    loading={false}
                                    data={address_list}
                                    dataMeta={{}}
                                />
                            </div>
                        </Tab>
                    </Tabs>
                </div>

                <div className="col-md-6 white-box add-contact-method-top w-100 h-100">
                    <div className="form-row">
                        {companyInfoActiveTab === "contact-methods" ? (
                            <>
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
                                {contactAddStatus ? (
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
                                    setContactMethodsValue={
                                        setContactMethodsValue
                                    }
                                />
                            </>
                        ) : null}

                        {companyInfoActiveTab === "addresses" ? (
                            <>
                                {addressesError ? (
                                    <PageAlert
                                        className="mt-3 w-100"
                                        variant="warning"
                                        timeout={5000}
                                        dismissible
                                    >
                                        Error: {addressesError}
                                    </PageAlert>
                                ) : null}
                                {addressAddStatus ? (
                                    <PageAlert
                                        className="mt-3 w-100"
                                        variant="success"
                                        timeout={5000}
                                        dismissible
                                    >
                                        Address successfully added.
                                    </PageAlert>
                                ) : null}
                                <AddressForm
                                    addressFormValue={addressFormValue}
                                    addressTypesOptions={addressTypesOptions}
                                    setAddressFormValue={setAddressFormValue}
                                />
                            </>
                        ) : null}

                        <Button
                            icon="plus"
                            iconSize="sm"
                            label="Add"
                            className="btn btn-block mx-1"
                            onClick={() => {
                                handleAdd();
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default TabCompanyInfo;

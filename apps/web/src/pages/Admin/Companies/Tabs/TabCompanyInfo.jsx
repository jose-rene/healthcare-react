import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Form, Tabs, Tab } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { isEmpty } from "lodash";

import TableAPI from "../../../../components/elements/TableAPI";
import ContactMethods from "../../../../components/elements/ContactMethods";
import PageAlert from "../../../../components/elements/PageAlert";

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
        name,
        category_id,
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
            columnMap: "number",
            label: "Number",
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
    const [contactMethods, setContactMethods] = useState([
        { type: "type", phone_email: "phone_email" },
    ]);
    const [contacts, setContacts] = useState({});
    const [companyInfoStatus, setCompanyInfoStatus] = useState(false);

    useEffect(() => {
        requestCategoryData();
    }, []);

    useEffect(() => {
        if (isEmpty(categoryData)) {
            return;
        }

        const { payer_categories } = categoryData;

        const payerArr = [{ id: "", title: "", val: "" }];
        for (const [key, value] of Object.entries(payer_categories)) {
            payerArr.push({ id: value.id, title: value.name, val: value.id });
        }

        setPayerCategoryOptions(payerArr);
    }, [categoryData]);

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
        url: `/admin/payers/${company_id}`,
    });

    const handleUpdate = async (formUpdateData) => {
        try {
            const result = await companyInfoUpdateRequest({
                params: formUpdateData,
            });

            setCompanyInfoStatus(true);
        } catch (e) {
            setCompanyInfoStatus(false);
            console.log("Company Info Update Error:", e);
        }
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
                                defaultValue={name}
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
                            <InputText
                                name="member_number_types"
                                label="Member ID Types"
                                placeholder="MediCaid"
                                defaultValue={member_number_types}
                                errors={errors}
                                ref={register({
                                    required: "Member ID Types is required",
                                })}
                            />
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
                                    defaultValue={has_phi}
                                    errors={errors}
                                    ref={register({})}
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
                            <div className="white-box mt-0">
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

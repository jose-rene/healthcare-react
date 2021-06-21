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

const contactTestData = [
    {
        id: "contactTestData",
        description: "Home",
        number: "(702) 555-0122",
    },
];

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

const TabCompanyInfo = () => {
    const history = useHistory();
    const company_id = history.location.pathname.split("/")[3];

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

    const { handleSubmit } = useForm();

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
    const [addContactStatus, setAddContactStatus] = useState(false);

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

    const onSubmit = async () => {
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
                setAddContactStatus(true);
            }
        } catch (e) {
            console.log("Add Contact Methods Error:", e);
        }
    };

    const setContactMethodsValue = ({ target: { name, value } }) => {
        setContacts({ ...contacts, [name]: value });
    };

    return (
        <>
            <div className="white-box white-box-small">
                <div className="row">
                    <div className="col-md-3">
                        <InputText
                            name="name"
                            label="Name"
                            placeholder="Name"
                        />
                    </div>
                    <div className="col-md-3">
                        <InputText
                            name="abbreviation"
                            label="Abbreviation"
                            placeholder="Name"
                        />
                    </div>
                    <div className="col-md-3">
                        <InputText
                            name="member-id-types"
                            label="Member ID Types"
                            placeholder="MediCaid"
                        />
                    </div>
                    <div className="col-md-3">
                        <Select
                            name="subCategory"
                            label="Payer Category"
                            options={payerCategoryOptions}
                        />
                    </div>
                    <div className="col-md-3">
                        <InputText
                            name="assessment-label"
                            label="Assessment Label"
                            placeholder="Placeholder"
                        />
                    </div>
                    <div className="col-md-3">
                        <div className="form-control custom-checkbox">
                            <Checkbox
                                labelLeft
                                name="molina"
                                label="Includes PHI"
                            />
                        </div>
                    </div>
                </div>
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
                                    data={contactTestData}
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

                <div className="col-md-6 white-box add-contact-method-top">
                    <Form onSubmit={handleSubmit(onSubmit)}>
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
                            {addContactStatus ? (
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
                                type="Submit"
                            />
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default TabCompanyInfo;

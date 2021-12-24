import React, { useState, useEffect } from "react";
import { Tabs, Tab, Row, Col } from "react-bootstrap";
import { isEmpty } from "lodash";

import AddressTab from "../AddressTab";
import ContactTab from "../ContactTab";
import CompanyDetailForm from "../ClientDetailForm";

import useApiCall from "hooks/useApiCall";

const TabCompanyInfo = ({ data, setUpdateSuccess, company_id }) => {
    const {
        id: payerId,
        category,
        contacts,
        member_number_types,
        address_list,
    } = data;

    const [{ data: categoryData }, requestCategoryData] = useApiCall({
        url: "/admin/company/categories",
    });

    const [companyInfoActiveTab, setCompanyInfoActiveTab] =
        useState("contact-methods");
    const [payerCategoryOptions, setPayerCategoryOptions] = useState([]);
    const [memberIdTypesOptions, setMemberIdTypesOptions] = useState([]);
    const [addressTypesOptions, setAddressTypesOptions] = useState([]);
    const [memberIdTypesValue, setMemberIdTypesValue] = useState([]);

    useEffect(() => {
        requestCategoryData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setUpdateSuccess(false);
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

    return (
        <>
            <CompanyDetailForm
                company_id={company_id}
                data={data}
                payerCategoryOptions={payerCategoryOptions}
                memberIdTypesOptions={memberIdTypesOptions}
                memberIdTypesValue={memberIdTypesValue}
            />

            <Row>
                <Col md={12}>
                    <Tabs
                        defaultActiveKey="contact-methods"
                        activeKey={companyInfoActiveTab}
                        className="inside-tabs"
                        onSelect={setCompanyInfoActiveTab}
                    >
                        <Tab eventKey="contact-methods" title="Contact Methods">
                            <ContactTab
                                contacts={contacts}
                                payerId={payerId}
                                company_id={company_id}
                            />
                        </Tab>

                        <Tab eventKey="addresses" title="Addresses">
                            <AddressTab
                                addressTypesOptions={addressTypesOptions}
                                payerId={payerId}
                                address_list={address_list}
                                company_id={company_id}
                            />
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </>
    );
};

export default TabCompanyInfo;

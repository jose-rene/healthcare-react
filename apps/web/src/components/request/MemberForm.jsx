/* eslint-disable no-nested-ternary */
import React, { useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";

import { useFormContext } from "Context/FormContext";

import AddressForm from "components/elements/AddressForm";
import PhoneInput from "components/inputs/PhoneInput";
import ContextSelect from "components/contextInputs/Select";
import ContextInput from "components/inputs/ContextInput";

const MemberForm = ({ payer, assessmentForm = false }) => {
    const [plan, setPlan] = useState(null);
    const { update: setValue } = useFormContext();

    // plan options
    const planOptions = useMemo(() => {
        const plansKey = payer.payers?.length
            ? "payers"
            : payer.siblings?.length
            ? "siblings"
            : null;
        if (!plansKey) {
            return [];
        }
        const selected = payer[plansKey].find((item) => {
            return item.id === payer.id;
        });
        setPlan(selected);
        return payer[plansKey].map(
            ({ id, company_name, lines_of_business }) => {
                return {
                    id,
                    title: company_name,
                    val: id,
                    lines_of_business,
                };
            }
        );
    }, [payer]);

    // line of business options, based on chosen plan
    const lobOptions = useMemo(() => {
        if (!plan?.lines_of_business?.length) {
            return [];
        }

        const options = plan.lines_of_business.map(({ id, name }) => {
            return { id, title: name, val: id };
        });
        return [{ id: "0", title: "", val: "" }, ...options];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plan]);

    const languageOptions = useMemo(() => {
        if (!payer?.languages?.length) {
            return [];
        }

        return payer.languages.map(({ id, name }) => {
            return { id, title: name, val: id };
        });
    }, [payer]);

    // handle plan change
    const updatePlan = (e) => {
        const newPlan = planOptions.find((item) => item.id === e.target.value);
        // element is controlled in form context
        setValue("plan", newPlan ? newPlan.id : "");
        setPlan(newPlan);
    };

    return (
        <>
            <AddressForm />
            <Row>
                <Col xl={6}>
                    <PhoneInput name="phone" label="Phone" />
                </Col>

                <Col xl={6}>
                    {!assessmentForm ? (
                        <ContextInput name="member_number" label="Member ID" />
                    ) : (
                        <ContextInput
                            name="dob"
                            label="Date of Birth*"
                            type="date"
                            style={{ width: "100%" }}
                        />
                    )}
                </Col>
            </Row>
            {!assessmentForm ? (
                <Row>
                    {planOptions?.length ? (
                        <Col xl={6}>
                            <ContextSelect
                                name="plan"
                                label="Plan"
                                options={planOptions}
                                required
                                large
                                onChange={updatePlan}
                            />
                        </Col>
                    ) : (
                        <ContextInput hidden name="plan" readOnly />
                    )}
                    <Col xl={6}>
                        <ContextSelect
                            name="line_of_business"
                            label="Line of Business"
                            options={lobOptions}
                        />
                    </Col>
                </Row>
            ) : (
                <Row>
                    <Col xl={6}>
                        <ContextSelect
                            name="gender"
                            label="Gender*"
                            options={[
                                {
                                    id: "male",
                                    title: "Male",
                                    val: "male",
                                },
                                {
                                    id: "female",
                                    title: "Female",
                                    val: "female",
                                },
                            ]}
                        />
                    </Col>

                    <Col xl={6}>
                        <ContextSelect
                            name="language_id"
                            label="Language*"
                            options={languageOptions}
                        />
                    </Col>
                </Row>
            )}
        </>
    );
};
export default MemberForm;

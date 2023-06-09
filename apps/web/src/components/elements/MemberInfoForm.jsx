import React, { useState, useMemo } from "react";
import { useFormContext } from "Context/FormContext";
import { Col } from "react-bootstrap";
import ContextInput from "components/inputs/ContextInput";
import ContextSelect from "components/contextInputs/Select";
/* eslint-disable no-nested-ternary */

const MemberInfoForm = ({ payer }) => {
    const [plan, setPlan] = useState(null);
    const { update: setValue } = useFormContext();

    // member type options
    const memberNumberTypesOptions = useMemo(() => {
        if (!payer?.member_number_types?.length) {
            return [];
        }
        const options = payer.member_number_types.map(({ id, title }) => {
            return { id, title, val: id };
        });
        return [{ id: "0", title: "", val: "" }, ...options];
    }, [payer]);

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
        const options = payer[plansKey].map(
            ({ id, company_name, lines_of_business }) => {
                return {
                    id,
                    title: company_name,
                    val: id,
                    lines_of_business,
                };
            }
        );
        return [
            { id: "0", title: "", val: "", lines_of_business: [] },
            ...options,
        ];
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

    // handle plan change
    const updatePlan = (e) => {
        const newPlan = planOptions.find((item) => item.id === e.target.value);
        // element is controlled in form context
        setValue("plan", newPlan ? newPlan.id : "");
        setPlan(newPlan);
    };

    return (
        <>
            {planOptions.length > 0 ? (
                <Col md={6}>
                    <ContextSelect
                        name="plan"
                        label="Plan*"
                        options={planOptions}
                        required
                        large
                        onChange={updatePlan}
                    />
                </Col>
            ) : (
                <ContextInput
                    hidden
                    name="plan"
                    value={payer.id || ""}
                    readOnly
                />
            )}
            <Col md={6} />

            <Col md={12}>
                <h1 className="box-outside-title title-second my-4">
                    Member Identification Info
                </h1>
            </Col>

            <Col md={6}>
                <ContextInput name="member_number" label="Member ID*" />
            </Col>

            <Col md={6}>
                <ContextSelect
                    name="member_number_type"
                    label="Member ID Type*"
                    options={memberNumberTypesOptions}
                />
            </Col>

            <Col md={6}>
                <ContextSelect
                    name="line_of_business"
                    label="Line of Business*"
                    options={lobOptions}
                />
            </Col>
        </>
    );
};

export default MemberInfoForm;
